using fitcore_backend.Application;
using fitcore_backend.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _db;

    public UserController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetProfile()
    {
        var id = Guid.Parse(User.FindFirst("id")!.Value);

        var user = _db.Users
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.Email,
                x.Username,
                x.IsPremium,
                x.CreatedAt,
                x.Age,
                x.HeightCm,
                x.WeightKg,

                Workouts = x.Workouts.Select(w => new {
                    w.Id,
                    w.Date,
                    w.DurationMinutes,
                }).ToList(),

                Measurements = x.Measurements.Select(m => new {
                    m.Id,
                    m.Date,
                    m.WeightKg,
                    m.ChestCm,
                    m.WaistCm,
                }).ToList(),

                NutritionDays = x.NutritionDays.Select(n => new {
                    n.Id,
                    n.Date,
                    n.ConsumedCalories,
                    n.TargetCalories,
                    Meals = n.Meals.Select(meal => new {
                        meal.Id,
                        meal.MealType,
                        meal.Protein,
                        meal.Fat,
                        meal.Carbs
                    }).ToList()
                }).ToList()
            })
            .First();

        return Ok(user);
    }
    [HttpPut("weight")]
    public IActionResult UpdateWeight([FromBody] WeightUpdateRequest request)
    {
        if (request.WeightKg <= 0)
            return BadRequest("Вес должен быть положительным числом.");

        var userId = Guid.Parse(User.FindFirst("id")!.Value);
        var user = _db.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null)
            return NotFound("Пользователь не найден.");

        // Обновляем вес
        user.WeightKg = request.WeightKg;

        // Можно также добавить запись в Measurements для истории
        _db.Measurements.Add(new Measurement
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WeightKg = request.WeightKg,
            Date = DateTime.UtcNow
        });

        _db.SaveChanges();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Username,
            user.IsPremium,
            user.CreatedAt,
            user.Age,
            user.HeightCm,
            user.WeightKg
        });
    }

// DTO для запроса
    public class WeightUpdateRequest
    {
        public double WeightKg { get; set; }
    }



}