using Microsoft.AspNetCore.Identity;

namespace Tash_MG.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        
        // MFA Properties
        public bool TwoFactorEnabled { get; set; }
        public string? TwoFactorSecret { get; set; }
        public DateTime? TwoFactorExpiry { get; set; }
        public bool IsEmailVerified { get; set; }
    }
} 