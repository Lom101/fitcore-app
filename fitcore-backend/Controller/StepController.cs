using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fitcore_backend.Application;
using fitcore_backend.Entity;
using fitcore_backend.Dto;

[ApiController]
[Route("api/steps")]
[Authorize]
public class StepController : ControllerBase
{
    private readonly AppDbContext _db;
    public StepController(AppDbContext db) => _db = db;

    private Guid GetUserId() => Guid.Parse(User.FindFirst("id")!.Value);

    [HttpGet("today")]
    public IActionResult GetToday()
    {
        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;

        var steps = _db.StepLogs.FirstOrDefault(s => s.UserId == userId && s.Date == today);

        if (steps == null)
        {
            steps = new StepLog { Id = Guid.NewGuid(), UserId = userId, Date = today, Steps = 0 };
            _db.StepLogs.Add(steps);
            _db.SaveChanges();
        }

        return Ok(new StepLogDto { Id = steps.Id, Date = steps.Date, Steps = steps.Steps });
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddSteps(AddStepLogDto dto)
    {
        if (dto.Steps < 0) return BadRequest("Шаги не могут быть отрицательными");

        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;

        var steps = await _db.StepLogs.FirstOrDefaultAsync(s => s.UserId == userId && s.Date == today);

        if (steps == null)
        {
            steps = new StepLog { Id = Guid.NewGuid(), UserId = userId, Date = today, Steps = dto.Steps };
            _db.StepLogs.Add(steps);
        }
        else
        {
            steps.Steps = dto.Steps;
            _db.StepLogs.Update(steps);
        }

        await _db.SaveChangesAsync();

        return Ok(new StepLogDto { Id = steps.Id, Date = steps.Date, Steps = steps.Steps });
    }
}