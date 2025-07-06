using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tash_MG.Data;
using Tash_MG.Model;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Tash_MG.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class TasksController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        // Create a new task
        [HttpPost]
        public JsonResult Create(TaskItem task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return new(Ok(task));
        }

        // Get all tasks
        [HttpGet("/tasks/all")]
        public JsonResult GetAll()
        {
            var result = _context.Tasks.ToList();
            return new(Ok(result));
        }

        [HttpPut("/tasks/update/user/{id}")]
        public JsonResult UpdateUser(int id, [FromBody] int userId)
        {
            var existingTask = _context.Tasks.Find(id);

            if (existingTask == null)
            {
                return new(NotFound("Task not found."));
            }
            existingTask.AssignedToId = userId;
            _context.SaveChanges();
            return new(Ok(existingTask));
        }

        [HttpPut("/tasks/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] TaskItem updatedTask)
        {
            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null)
            {
                return NotFound("Task not found.");
            }

            existingTask.Status = updatedTask.Status;
            await _context.SaveChangesAsync();
            return Ok(existingTask);
        }
    }
}
