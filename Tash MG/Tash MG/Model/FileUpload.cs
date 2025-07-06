using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tash_MG.Model
{
    public class FileUpload
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        public string FileType { get; set; } = string.Empty;

        public long FileSize { get; set; }

        [Required]
        public string EncryptionKey { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UploadedBy")]
        public int UploadedById { get; set; }
        public User UploadedBy { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
    }
} 