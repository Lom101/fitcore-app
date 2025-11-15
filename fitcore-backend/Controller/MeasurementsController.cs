using fitcore_backend.Application;
using fitcore_backend.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/measurements")]
[Authorize]
public class MeasurementsController : ControllerBase
{
    private readonly AppDbContext _db;

    public MeasurementsController(AppDbContext db)
    {
        _db = db;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst("id")!.Value);

    [HttpGet]
    public IActionResult GetAll()
    {
        var id = GetUserId();
        var list = _db.Measurements.Where(x => x.UserId == id).ToList();
        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Add(Measurement dto)
    {
        dto.Id = Guid.NewGuid();
        dto.UserId = GetUserId();

        _db.Measurements.Add(dto);
        await _db.SaveChangesAsync();

        return Ok(dto);
    }
}