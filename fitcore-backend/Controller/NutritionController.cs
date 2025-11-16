using fitcore_backend.Application;
using fitcore_backend.Dto;
using fitcore_backend.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/nutrition")]
[Authorize]
public class NutritionController : ControllerBase
{
    private readonly AppDbContext _db;

    public NutritionController(AppDbContext db)
    {
        _db = db;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst("id")!.Value);
    
    [HttpGet("all")]
    public IActionResult GetAllNutrition()
    {
        var userId = GetUserId();

        var days = _db.NutritionDays
            .Where(d => d.UserId == userId)
            .Include(d => d.Meals)
            .OrderBy(d => d.Date)
            .ToList();

        var dtoList = days.Select(day => new NutritionDayDto
        {
            Id = day.Id,
            Date = day.Date,
            ConsumedCalories = day.ConsumedCalories,
            TargetCalories = day.TargetCalories,
            Meals = day.Meals.Select(m => new MealDto
            {
                Id = m.Id,
                MealType = m.MealType,
                Protein = m.Protein,
                Fat = m.Fat,
                Carbs = m.Carbs
            }).ToList()
        }).ToList();

        return Ok(dtoList);
    }
    
    [HttpGet("today")]
    public IActionResult GetToday()
    {
        var id = GetUserId();
        var today = DateTime.UtcNow.Date;

        var day = _db.NutritionDays
            .Include(x => x.Meals)
            .FirstOrDefault(x => x.UserId == id && x.Date == today);

        if (day == null)
        {
            day = new NutritionDay
            {
                UserId = id,
                Date = today,
                TargetCalories = 2000,
                ConsumedCalories = 0,
                Meals = new List<Meal>() 
            };
            _db.NutritionDays.Add(day);
            _db.SaveChanges();
        }

        var dto = new NutritionDayDto
        {
            Id = day.Id,
            Date = day.Date,
            ConsumedCalories = day.ConsumedCalories,
            TargetCalories = day.TargetCalories,
            Meals = day.Meals.Select(m => new MealDto
            {
                Id = m.Id,
                MealType = m.MealType,
                Protein = m.Protein,
                Fat = m.Fat,
                Carbs = m.Carbs
            }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost("add-meal")]
    public async Task<IActionResult> AddMeal(MealDto dto)
    {
        var id = GetUserId();
        var today = DateTime.UtcNow.Date;

        var day = _db.NutritionDays.Include(d => d.Meals)
            .FirstOrDefault(x => x.UserId == id && x.Date == today);

        if (day == null)
        {
            day = new NutritionDay
            {
                UserId = id,
                Date = today,
                TargetCalories = 2000,
                ConsumedCalories = 0,
                Meals = new List<Meal>() 
            };
            _db.NutritionDays.Add(day);
        }

        var meal = new Meal
        {
            Id = Guid.NewGuid(),
            NutritionDayId = day.Id,
            MealType = dto.MealType,
            Protein = dto.Protein,
            Fat = dto.Fat,
            Carbs = dto.Carbs
        };

        _db.Meals.Add(meal);
        day.ConsumedCalories += (meal.Protein * 4 + meal.Carbs * 4 + meal.Fat * 9);

        await _db.SaveChangesAsync();

        var resultDto = new MealDto
        {
            Id = meal.Id,
            MealType = meal.MealType,
            Protein = meal.Protein,
            Fat = meal.Fat,
            Carbs = meal.Carbs
        };

        return Ok(resultDto);
    }
    
    [HttpDelete("meal/{mealId}")]
    public async Task<IActionResult> DeleteMeal(Guid mealId)
    {
        var meal = await _db.Meals.FindAsync(mealId);
        if (meal == null) return NotFound();

        var day = await _db.NutritionDays.FindAsync(meal.NutritionDayId);
        if (day != null)
        {
            day.ConsumedCalories -= (meal.Protein * 4 + meal.Carbs * 4 + meal.Fat * 9);
        }

        _db.Meals.Remove(meal);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}