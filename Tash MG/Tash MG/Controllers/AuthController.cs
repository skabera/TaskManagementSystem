using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tash_MG.Data;
using Tash_MG.Model;
using Tash_MG.Model.DTOs;
using Tash_MG.Services;

namespace Tash_MG.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly Random _random;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IEmailService emailService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _emailService = emailService;
            _random = new Random();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                TwoFactorEnabled = true // Enable 2FA by default
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Generate and send OTP
                var otp = GenerateOtp();
                user.TwoFactorSecret = otp;
                user.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(5);
                await _userManager.UpdateAsync(user);
                await _emailService.SendOtpEmailAsync(user.Email!, otp);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "User registered successfully. Please verify your email with the OTP sent."
                });
            }

            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = string.Join(", ", result.Errors.Select(x => x.Description))
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!result)
            {
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            if (user.TwoFactorEnabled)
            {
                // Generate and send OTP
                var otp = GenerateOtp();
                user.TwoFactorSecret = otp;
                user.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(5);
                await _userManager.UpdateAsync(user);
                await _emailService.SendOtpEmailAsync(user.Email!, otp);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Please enter the OTP sent to your email"
                });
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60)
            });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyMfaRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new MfaResponse
                {
                    Success = false,
                    Message = "Invalid email"
                });
            }

            if (user.TwoFactorSecret != model.Code || 
                user.TwoFactorExpiry < DateTime.UtcNow)
            {
                return Unauthorized(new MfaResponse
                {
                    Success = false,
                    Message = "Invalid or expired OTP"
                });
            }

            // Clear OTP after successful verification
            user.TwoFactorSecret = null;
            user.TwoFactorExpiry = null;
            user.IsEmailVerified = true;
            await _userManager.UpdateAsync(user);

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return Ok(new MfaResponse
            {
                Success = true,
                Message = "OTP verified successfully",
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60)
            });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();
            var key = Encoding.ASCII.GetBytes(jwtSettings.Key);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty),
                new(ClaimTypes.Name, $"{user.FirstName ?? string.Empty} {user.LastName ?? string.Empty}".Trim())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings.Issuer,
                audience: jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(jwtSettings.ExpiryInMinutes),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();
        }

        private string GenerateOtp()
        {
            return _random.Next(100000, 999999).ToString();
        }
    }
} 