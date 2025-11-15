using fitcore_backend.Entity;

namespace fitcore_backend.Application;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    public DbSet<WorkoutSet> WorkoutSets => Set<WorkoutSet>();
    public DbSet<Measurement> Measurements => Set<Measurement>();
    public DbSet<NutritionDay> NutritionDays => Set<NutritionDay>();
    public DbSet<Meal> Meals => Set<Meal>();
    public DbSet<StepLog> StepLogs => Set<StepLog>();


    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();
    }
}
