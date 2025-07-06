using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Tash_MG.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendOtpEmailAsync(string to, string otp);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _smtpServer = _configuration["EmailSettings:SmtpServer"] ?? throw new ArgumentNullException("SmtpServer");
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["EmailSettings:SmtpUsername"] ?? throw new ArgumentNullException("SmtpUsername");
            _smtpPassword = _configuration["EmailSettings:SmtpPassword"] ?? throw new ArgumentNullException("SmtpPassword");
            _fromEmail = _configuration["EmailSettings:FromEmail"] ?? throw new ArgumentNullException("FromEmail");
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            using var client = new SmtpClient(_smtpServer, _smtpPort)
            {
                Credentials = new System.Net.NetworkCredential(_smtpUsername, _smtpPassword),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(to);

            await client.SendMailAsync(message);
        }

        public async Task SendOtpEmailAsync(string to, string otp)
        {
            var subject = "Your Verification Code";
            var body = $@"
                <h2>Your Verification Code</h2>
                <p>Please use the following code to complete your verification:</p>
                <h1 style='font-size: 32px; letter-spacing: 5px;'>{otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>";

            await SendEmailAsync(to, subject, body);
        }
    }
} 