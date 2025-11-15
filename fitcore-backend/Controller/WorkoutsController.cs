using fitcore_backend.Application;
using fitcore_backend.Dto;
using fitcore_backend.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/workouts")]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly AppDbContext _db;

    public WorkoutsController(AppDbContext db)
    {
        _db = db;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst("id")!.Value);

    [HttpGet]
    public IActionResult GetAll()
    {
        var id = GetUserId();

        var list = _db.Workouts
            .Where(x => x.UserId == id)
            .Include(x => x.Exercises)
            .ThenInclude(e => e.Sets)
            .Select(w => new WorkoutDto
            {
                Id = w.Id,
                Title = w.Title,
                Completed = w.Completed,
                DurationMinutes = w.DurationMinutes,
                Date = w.Date,
                Exercises = w.Exercises.Select(e => new WorkoutExerciseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Completed = e.Completed,
                    Sets = e.Sets.Select(s => new WorkoutSetDto
                    {
                        Id = s.Id,
                        Reps = s.Reps,
                        Weight = s.Weight,
                        Completed = s.Completed,
                    }).ToList()
                }).ToList()
            })
            .ToList();

        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create(WorkoutCreateDto dto)
    {
        var workout = new Workout
        {
            Id = Guid.NewGuid(),
            UserId = GetUserId(),
            Title = dto.Title,
            Date = dto.Date,
            DurationMinutes = dto.DurationMinutes,
            Exercises = dto.Exercises.Select(ex => new WorkoutExercise
            {
                Id = Guid.NewGuid(),
                Name = ex.Name,
                Sets = ex.Sets.Select(s => new WorkoutSet
                {
                    Id = Guid.NewGuid(),
                    Reps = s.Reps,
                    Weight = s.Weight
                }).ToList()
            }).ToList()
        };

        _db.Workouts.Add(workout);
        await _db.SaveChangesAsync();

        return Ok();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var workout = await _db.Workouts
            .Include(w => w.Exercises)
            .ThenInclude(e => e.Sets)
            .FirstOrDefaultAsync(w => w.Id == id && w.UserId == GetUserId());

        if (workout == null)
            return NotFound();

        _db.Workouts.Remove(workout);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var workout = _db.Workouts.FirstOrDefault(x => x.Id == id);
        if (workout == null) return NotFound();

        workout.Completed = !workout.Completed;
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }
    
    [HttpPost("{workoutId}/exercise/{exerciseId}/complete")]
    public async Task<IActionResult> CompleteExercise(Guid workoutId, Guid exerciseId)
    {
        var exercise = await _db.WorkoutExercises
            .FirstOrDefaultAsync(e => e.Id == exerciseId && e.WorkoutId == workoutId);

        if (exercise == null) return NotFound();

        exercise.Completed = !exercise.Completed;
        await _db.SaveChangesAsync();
        return Ok(new { exerciseId = exercise.Id, completed = exercise.Completed });
    }

    [HttpPost("{workoutId}/exercise/{exerciseId}/set/{setId}/complete")]
    public async Task<IActionResult> CompleteSet(Guid workoutId, Guid exerciseId, Guid setId)
    {
        var set = await _db.WorkoutSets
            .Include(s => s.WorkoutExercise)
            .FirstOrDefaultAsync(s => s.Id == setId && s.WorkoutExerciseId == exerciseId && s.WorkoutExercise.WorkoutId == workoutId);

        if (set == null) return NotFound();

        set.Completed = !set.Completed;
        await _db.SaveChangesAsync();
        return Ok(new { setId = set.Id, completed = set.Completed });
    }
}