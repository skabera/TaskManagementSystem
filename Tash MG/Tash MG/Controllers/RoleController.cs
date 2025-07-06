using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Tash_MG.Data;
using Tash_MG.Model;

namespace Tash_MG.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class RoleController(RoleManager<IdentityRole> roleManager, ApplicationDbContext context) : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly ApplicationDbContext _context = context;

        //create role 
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty");
            }

            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists)
            {
                return BadRequest("Role already exists");
            }

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
            {
                return Ok(new { message = "Role created successfully" });
            }

            return BadRequest(result.Errors);
        }

        //get all roles
        [HttpGet("/all")]
        public IActionResult GetAll()
        {
            var roles = _roleManager.Roles.ToList();
            return Ok(roles);
        }
    }
}
