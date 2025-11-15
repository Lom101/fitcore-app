using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using fitcore_backend.Application;
using fitcore_backend.Entity;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (_db.Users.Any(x => x.Email == dto.Email))
            return BadRequest("Email already exists");

        var user = new User
        {
            Email = dto.Email,
            Password = dto.Password,
            Username = dto.Username,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _db.Users.FirstOrDefault(x => x.Email == dto.Email && x.Password == dto.Password);
        if (user == null) return Unauthorized();

        var key = Encoding.UTF8.GetBytes(_cfg["JwtKey"]!);
        var token = new JwtSecurityToken(
            claims: new[] { new Claim("id", user.Id.ToString()) },
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token)
        });
    }
}

public record RegisterDto(string Email, string Password, string Username);
public record LoginDto(string Email, string Password);