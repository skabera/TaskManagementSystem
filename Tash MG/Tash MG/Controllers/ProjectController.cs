using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Tash_MG.Data;
using Tash_MG.Model;

namespace Tash_MG.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ProjectController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        // Create a project
        [HttpPost]
        public JsonResult Create(Project project)
        {
            _context.Projects.Add(project);
            _context.SaveChanges();
            return new(Ok(project));
        }

        // Get all projects
        [HttpGet("/projects/all")]
        public JsonResult GetAll()
        {
            var result = _context.Projects.ToList();
            return new(Ok(result));
        }
    }
}
