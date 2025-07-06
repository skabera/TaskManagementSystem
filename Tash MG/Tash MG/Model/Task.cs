using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tash_MG.Model
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueDate { get; set; }

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed, Cancelled

        [Required]
        public string Priority { get; set; } = "Medium"; // Low, Medium, High

        [ForeignKey("AssignedTo")]
        public int? AssignedToId { get; set; }
        public User? AssignedTo { get; set; }

        [ForeignKey("CreatedBy")]
        public int CreatedById { get; set; }
        public User CreatedBy { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
    }
} 