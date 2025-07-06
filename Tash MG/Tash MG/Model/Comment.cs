﻿using System.ComponentModel.DataAnnotations;

namespace Tash_MG.Model
{
    public class Comment
    {
        public int Id { get; set; }

        public int TaskId { get; set; }

        public int UserId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;

        public TaskItem Task { get; set; } = null!;
    }
}
