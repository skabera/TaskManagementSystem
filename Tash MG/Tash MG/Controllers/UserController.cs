using Microsoft.AspNetCore.Mvc;
using Tash_MG.Data;
using Tash_MG.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Tash_MG.Model.DTOs;

namespace Tash_MG.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController(UserManager<ApplicationUser> userManager, ApplicationDbContext context) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RegisterRequest model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { message = "User created successfully", user });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(new { message = "Login successful", user });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(string id, [FromBody] ApplicationUser updatedUser)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null) return NotFound();

            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.Email = updatedUser.Email;

            if (!string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(existingUser);
                await _userManager.ResetPasswordAsync(existingUser, token, updatedUser.PasswordHash);
            }

            var result = await _userManager.UpdateAsync(existingUser);
            if (result.Succeeded)
            {
                return Ok(existingUser);
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("/users/all")]
        public IActionResult GetAll()
        {
            var users = _userManager.Users.ToList();
            return Ok(users);
        }
    }
}
