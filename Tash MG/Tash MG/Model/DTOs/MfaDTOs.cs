namespace Tash_MG.Model.DTOs
{
    public class EnableMfaRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyMfaRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class MfaResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? Expiration { get; set; }
    }
} 