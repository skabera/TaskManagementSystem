using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Tash_MG.Data;
using Tash_MG.Model;
using Microsoft.EntityFrameworkCore;

namespace Tash_MG.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class CommentController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        // Create a new comment
        [HttpPost]
        public JsonResult Create(Comment comment)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return new(Ok(comment));
        }

        // Get all comments
        [HttpGet("/comments/all")]
        public JsonResult GetAll()
        {
            var result = _context.Comments.ToList();
            return new(Ok(result));
        }
    }
}
