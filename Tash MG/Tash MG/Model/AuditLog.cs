using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tash_MG.Model
{
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Action { get; set; } = string.Empty; // Login, Create, Update, Delete, etc.

        [Required]
        public string EntityType { get; set; } = string.Empty; // User, Task, File, etc.

        public string? EntityId { get; set; }

        public string? OldValues { get; set; }

        public string? NewValues { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public User? User { get; set; }

        public string? IpAddress { get; set; }

        public string? UserAgent { get; set; }
    }
} 