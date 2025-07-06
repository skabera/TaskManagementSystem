using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Tash_MG.Model;

namespace Tash_MG.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> CustomUsers { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<FileUpload> FileUploads { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            // Configure User entity
            builder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.Role).IsRequired();
            });

            // Configure Task entity
            builder.Entity<TaskItem>(entity =>
            {
                entity.ToTable("Tasks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.Priority).IsRequired();
                
                entity.HasOne(e => e.AssignedTo)
                    .WithMany()
                    .HasForeignKey(e => e.AssignedToId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure FileUpload entity
            builder.Entity<FileUpload>(entity =>
            {
                entity.ToTable("FileUploads");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FileName).IsRequired();
                entity.Property(e => e.FilePath).IsRequired();
                entity.Property(e => e.FileType).IsRequired();
                entity.Property(e => e.EncryptionKey).IsRequired();

                entity.HasOne(e => e.UploadedBy)
                    .WithMany()
                    .HasForeignKey(e => e.UploadedById)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure AuditLog entity
            builder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("AuditLogs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Action).IsRequired();
                entity.Property(e => e.EntityType).IsRequired();
                entity.Property(e => e.Timestamp).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Project entity
            builder.Entity<Project>(entity =>
            {
                entity.ToTable("Projects");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
            });

            // Configure Comment entity
            builder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comments");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Task)
                    .WithMany()
                    .HasForeignKey(e => e.TaskId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 