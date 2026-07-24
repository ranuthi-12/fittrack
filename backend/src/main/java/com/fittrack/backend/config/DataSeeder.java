package com.fittrack.backend.config;

import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final TrainerMemberRepository trainerMemberRepository;
    private final MembershipRepository membershipRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final ProgressLogRepository progressLogRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedCoreData();
        }

        // Independent of the guard above: fills in the trainer "Recent
        // activity" feed and member "Exercise progress" logs if those two
        // tables are still empty (e.g. your DB already had users seeded
        // before these tables/records were added).
        seedActivityAndProgressIfMissing();
    }

    private void seedCoreData() {

        // ───────────────────────────────────────────────
        // 1. Users
        // ───────────────────────────────────────────────
        String encodedPass = passwordEncoder.encode("password123");

        User admin = userRepository.save(User.builder()
                .firstName("Admin").lastName("System")
                .email("admin@fittrack.com").password(encodedPass)
                .role(User.Role.ADMIN).phone("+94 77 000 0000")
                .passwordChanged(true).joinedDate(LocalDate.of(2025, 1, 1))
                .build());

        User trainerUser1 = userRepository.save(User.builder()
                .firstName("Kasun").lastName("Thilanka")
                .email("kasun@fittrack.com").password(encodedPass)
                .role(User.Role.TRAINER).phone("+94 77 111 2222")
                .passwordChanged(true).joinedDate(LocalDate.of(2025, 2, 1))
                .build());

        User trainerUser2 = userRepository.save(User.builder()
                .firstName("Amali").lastName("Perera")
                .email("amali@fittrack.com").password(encodedPass)
                .role(User.Role.TRAINER).phone("+94 77 222 3333")
                .passwordChanged(true).joinedDate(LocalDate.of(2025, 3, 1))
                .build());

        User trainerUser3 = userRepository.save(User.builder()
                .firstName("Ruwan").lastName("Jayasinghe")
                .email("ruwan@fittrack.com").password(encodedPass)
                .role(User.Role.TRAINER).phone("+94 77 333 4444")
                .passwordChanged(true).joinedDate(LocalDate.of(2025, 3, 15))
                .build());

        User member1 = userRepository.save(User.builder()
                .firstName("Ranuthi").lastName("N.")
                .email("ranuthi@fittrack.com").password(encodedPass)
                .role(User.Role.MEMBER).phone("+94 77 123 4567")
                .emergencyContact("+94 71 987 6543")
                .passwordChanged(true).joinedDate(LocalDate.of(2026, 6, 1))
                .build());

        User member2 = userRepository.save(User.builder()
                .firstName("Nimal").lastName("P.")
                .email("nimal@fittrack.com").password(encodedPass)
                .role(User.Role.MEMBER).phone("+94 77 234 5678")
                .passwordChanged(true).joinedDate(LocalDate.of(2026, 5, 15))
                .build());

        User member3 = userRepository.save(User.builder()
                .firstName("Kavya").lastName("F.")
                .email("kavya@fittrack.com").password(encodedPass)
                .role(User.Role.MEMBER).phone("+94 77 345 6789")
                .passwordChanged(true).joinedDate(LocalDate.of(2026, 4, 1))
                .build());

        User member4 = userRepository.save(User.builder()
                .firstName("Saman").lastName("L.")
                .email("saman@fittrack.com").password(encodedPass)
                .role(User.Role.MEMBER).phone("+94 77 456 7890")
                .passwordChanged(true).joinedDate(LocalDate.of(2026, 3, 1))
                .build());

        // ───────────────────────────────────────────────
        // 2. Trainers & Assignments
        //    (a member can only have ONE trainer — spread
        //     members across all 3 trainers so every trainer
        //     account has real data to show)
        // ───────────────────────────────────────────────
        Trainer trainer1 = trainerRepository.save(Trainer.builder()
                .user(trainerUser1).specialization("Strength and conditioning")
                .memberCount(2).joinedDate(LocalDate.of(2025, 2, 1)).build());

        Trainer trainer2 = trainerRepository.save(Trainer.builder()
                .user(trainerUser2).specialization("Cardio and flexibility")
                .memberCount(1).joinedDate(LocalDate.of(2025, 3, 1)).build());

        Trainer trainer3 = trainerRepository.save(Trainer.builder()
                .user(trainerUser3).specialization("Weight loss and nutrition")
                .memberCount(1).joinedDate(LocalDate.of(2025, 3, 15)).build());

        trainerMemberRepository.save(TrainerMember.builder().trainer(trainer1).member(member1).build());
        trainerMemberRepository.save(TrainerMember.builder().trainer(trainer1).member(member2).build());
        trainerMemberRepository.save(TrainerMember.builder().trainer(trainer2).member(member3).build());
        trainerMemberRepository.save(TrainerMember.builder().trainer(trainer3).member(member4).build());

        // ───────────────────────────────────────────────
        // 3. Memberships
        // ───────────────────────────────────────────────
        membershipRepository.save(Membership.builder()
                .user(member1).planType(Membership.PlanType.MONTHLY)
                .amountPaid(new BigDecimal("2500.00"))
                .status(Membership.Status.ACTIVE)
                .startDate(LocalDate.now().minusDays(20))
                .endDate(LocalDate.now().plusDays(10)).build());

        membershipRepository.save(Membership.builder()
                .user(member2).planType(Membership.PlanType.MONTHLY)
                .amountPaid(new BigDecimal("2500.00"))
                .status(Membership.Status.EXPIRING)
                .startDate(LocalDate.now().minusDays(25))
                .endDate(LocalDate.now().plusDays(3)).build());

        membershipRepository.save(Membership.builder()
                .user(member3).planType(Membership.PlanType.QUARTERLY)
                .amountPaid(new BigDecimal("6500.00"))
                .status(Membership.Status.ACTIVE)
                .startDate(LocalDate.now().minusDays(60))
                .endDate(LocalDate.now().plusDays(30)).build());

        membershipRepository.save(Membership.builder()
                .user(member4).planType(Membership.PlanType.MONTHLY)
                .amountPaid(new BigDecimal("2500.00"))
                .status(Membership.Status.EXPIRED)
                .startDate(LocalDate.now().minusDays(80))
                .endDate(LocalDate.now().minusDays(20)).build());

        // ───────────────────────────────────────────────
        // 4. Exercise Guide Library
        // ───────────────────────────────────────────────
        Exercise benchPress = exerciseRepository.save(Exercise.builder()
                .exerciseName("Barbell Bench Press").category("Chest").level("Intermediate")
                .equipment("Barbell & Bench").muscles("Pectoralis Major, Triceps, Anterior Deltoid")
                .instructions("Lie flat on bench, unrack barbell with medium grip width, lower smoothly to mid-chest, and press explosively upwards.")
                .recommended("3-4 sets x 8-12 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise inclinePress = exerciseRepository.save(Exercise.builder()
                .exerciseName("Incline Dumbbell Press").category("Chest").level("Beginner")
                .equipment("Dumbbells & Incline Bench").muscles("Upper Chest, Triceps")
                .instructions("Set bench to 30-45 degrees. Press dumbbells upward until arms are extended, lower slowly.")
                .recommended("3 sets x 10-12 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise latPulldown = exerciseRepository.save(Exercise.builder()
                .exerciseName("Lat Pulldown").category("Back").level("Beginner")
                .equipment("Cable Lat Machine").muscles("Latissimus Dorsi, Biceps, Rhomboids")
                .instructions("Grasp wide bar, sit upright, pull bar down towards upper chest while squeezing shoulder blades together.")
                .recommended("3-4 sets x 10-15 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise deadlift = exerciseRepository.save(Exercise.builder()
                .exerciseName("Barbell Deadlift").category("Back").level("Advanced")
                .equipment("Barbell").muscles("Erector Spinae, Glutes, Hamstrings")
                .instructions("Stand shoulder-width apart, hinge hips back, grip bar, keep chest up and drive through heels to lock out.")
                .recommended("3-5 sets x 5 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise squat = exerciseRepository.save(Exercise.builder()
                .exerciseName("Barbell Back Squat").category("Legs").level("Intermediate")
                .equipment("Barbell & Squat Rack").muscles("Quadriceps, Glutes, Hamstrings")
                .instructions("Rest barbell across upper traps, flex knees and hips to lower down to parallel, then drive upwards.")
                .recommended("4 sets x 8-10 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise bicepCurl = exerciseRepository.save(Exercise.builder()
                .exerciseName("Standing Dumbbell Bicep Curl").category("Arms").level("Beginner")
                .equipment("Dumbbells").muscles("Biceps Brachii")
                .instructions("Hold dumbbells at sides with palms forward. Curl weight up toward shoulders without swinging upper body.")
                .recommended("3 sets x 12-15 reps")
                .videoThumbnail("https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise plank = exerciseRepository.save(Exercise.builder()
                .exerciseName("Plank").category("Core").level("Beginner")
                .equipment("Bodyweight").muscles("Rectus Abdominis, Obliques, Lower Back")
                .instructions("Hold a straight-body position on forearms and toes, keeping hips level and core braced.")
                .recommended("3 sets x 45-60 sec hold")
                .videoThumbnail("https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80")
                .build());

        Exercise treadmillRun = exerciseRepository.save(Exercise.builder()
                .exerciseName("Treadmill Interval Run").category("Cardio").level("Intermediate")
                .equipment("Treadmill").muscles("Cardiovascular System, Quadriceps, Calves")
                .instructions("Alternate 1 minute fast pace with 2 minutes moderate pace for the full session.")
                .recommended("20-25 minutes")
                .videoThumbnail("https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80")
                .build());

        // ───────────────────────────────────────────────
        // 5. Workout Plans (trainer-assigned, real weekly split)
        //    Includes today's weekday so the demo always
        //    shows a live workout instead of "Rest Day".
        // ───────────────────────────────────────────────
        WorkoutDay.DayName today = WorkoutDay.DayName.values()[LocalDate.now().getDayOfWeek().getValue() - 1];

        // --- Plan for member1 (Ranuthi) — trainer1 ---
        WorkoutPlan plan1 = WorkoutPlan.builder()
                .trainer(trainer1).member(member1).planName("Strength Builder").build();
        WorkoutDay p1Day1 = WorkoutDay.builder().plan(plan1).dayName(WorkoutDay.DayName.Monday).focus("Chest & Triceps").build();
        p1Day1.setExercises(List.of(
                Exercise.builder().day(p1Day1).exerciseName("Barbell Bench Press").sets(4).reps(8).build(),
                Exercise.builder().day(p1Day1).exerciseName("Incline Dumbbell Press").sets(3).reps(10).build()
        ));
        WorkoutDay p1Day2 = WorkoutDay.builder().plan(plan1).dayName(WorkoutDay.DayName.Wednesday).focus("Back & Deadlifts").build();
        p1Day2.setExercises(List.of(
                Exercise.builder().day(p1Day2).exerciseName("Lat Pulldown").sets(3).reps(12).build(),
                Exercise.builder().day(p1Day2).exerciseName("Barbell Deadlift").sets(4).reps(5).build()
        ));
        WorkoutDay p1Day3 = WorkoutDay.builder().plan(plan1).dayName(WorkoutDay.DayName.Friday).focus("Legs").build();
        p1Day3.setExercises(List.of(
                Exercise.builder().day(p1Day3).exerciseName("Barbell Back Squat").sets(4).reps(8).build()
        ));
        plan1.setDays(List.of(p1Day1, p1Day2, p1Day3));
        workoutPlanRepository.save(plan1);

        // --- Plan for member2 (Nimal) — trainer1 ---
        WorkoutPlan plan2 = WorkoutPlan.builder()
                .trainer(trainer1).member(member2).planName("Beginner Full Body").build();
        WorkoutDay p2Day1 = WorkoutDay.builder().plan(plan2).dayName(WorkoutDay.DayName.Monday).focus("Full Body").build();
        p2Day1.setExercises(List.of(
                Exercise.builder().day(p2Day1).exerciseName("Barbell Back Squat").sets(3).reps(10).build(),
                Exercise.builder().day(p2Day1).exerciseName("Plank").sets(3).reps(1).durationMin(1).build()
        ));
        WorkoutDay p2Day2 = WorkoutDay.builder().plan(plan2).dayName(WorkoutDay.DayName.Wednesday).focus("Upper Body").build();
        p2Day2.setExercises(List.of(
                Exercise.builder().day(p2Day2).exerciseName("Barbell Bench Press").sets(3).reps(10).build(),
                Exercise.builder().day(p2Day2).exerciseName("Standing Dumbbell Bicep Curl").sets(3).reps(12).build()
        ));
        WorkoutDay p2Day3 = WorkoutDay.builder().plan(plan2).dayName(WorkoutDay.DayName.Friday).focus("Cardio").build();
        p2Day3.setExercises(List.of(
                Exercise.builder().day(p2Day3).exerciseName("Treadmill Interval Run").sets(1).durationMin(20).build()
        ));
        plan2.setDays(List.of(p2Day1, p2Day2, p2Day3));
        workoutPlanRepository.save(plan2);

        // --- Plan for member3 (Kavya) — trainer2 ---
        WorkoutPlan plan3 = WorkoutPlan.builder()
                .trainer(trainer2).member(member3).planName("Cardio & Flexibility").build();
        WorkoutDay p3Day1 = WorkoutDay.builder().plan(plan3).dayName(WorkoutDay.DayName.Tuesday).focus("Cardio").build();
        p3Day1.setExercises(List.of(
                Exercise.builder().day(p3Day1).exerciseName("Treadmill Interval Run").sets(1).durationMin(25).build()
        ));
        WorkoutDay p3Day2 = WorkoutDay.builder().plan(plan3).dayName(today).focus("Core & Mobility").build();
        p3Day2.setExercises(List.of(
                Exercise.builder().day(p3Day2).exerciseName("Plank").sets(3).reps(1).durationMin(1).build()
        ));
        plan3.setDays(List.of(p3Day1, p3Day2));
        workoutPlanRepository.save(plan3);

        // --- Plan for member4 (Saman) — trainer3 ---
        WorkoutPlan plan4 = WorkoutPlan.builder()
                .trainer(trainer3).member(member4).planName("Weight Loss Circuit").build();
        WorkoutDay p4Day1 = WorkoutDay.builder().plan(plan4).dayName(today).focus("Full Body Circuit").build();
        p4Day1.setExercises(List.of(
                Exercise.builder().day(p4Day1).exerciseName("Barbell Back Squat").sets(3).reps(12).build(),
                Exercise.builder().day(p4Day1).exerciseName("Treadmill Interval Run").sets(1).durationMin(15).build()
        ));
        plan4.setDays(List.of(p4Day1));
        workoutPlanRepository.save(plan4);

        // ───────────────────────────────────────────────
        // 6. Progress Logs (recent, within the current
        //    month/week so charts and PRs are populated)
        // ───────────────────────────────────────────────
        progressLogRepository.saveAll(List.of(
                ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("70.0")).repsDone(8).loggedDate(LocalDate.now().minusDays(12)).build(),
                ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("72.5")).repsDone(8).loggedDate(LocalDate.now().minusDays(7)).build(),
                ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("75.0")).repsDone(6).loggedDate(LocalDate.now().minusDays(2)).build(),
                ProgressLog.builder().member(member1).exercise(deadlift).weightKg(new BigDecimal("110.0")).repsDone(5).loggedDate(LocalDate.now().minusDays(5)).build(),
                ProgressLog.builder().member(member1).exercise(squat).weightKg(new BigDecimal("95.0")).repsDone(8).loggedDate(LocalDate.now().minusDays(1)).build(),

                ProgressLog.builder().member(member2).exercise(squat).weightKg(new BigDecimal("50.0")).repsDone(10).loggedDate(LocalDate.now().minusDays(9)).build(),
                ProgressLog.builder().member(member2).exercise(benchPress).weightKg(new BigDecimal("40.0")).repsDone(10).loggedDate(LocalDate.now().minusDays(4)).build(),

                ProgressLog.builder().member(member3).exercise(treadmillRun).weightKg(null).repsDone(null).loggedDate(LocalDate.now().minusDays(6)).build(),
                ProgressLog.builder().member(member3).exercise(plank).weightKg(null).repsDone(1).loggedDate(LocalDate.now().minusDays(3)).build(),

                ProgressLog.builder().member(member4).exercise(squat).weightKg(new BigDecimal("45.0")).repsDone(12).loggedDate(LocalDate.now().minusDays(2)).build()
        ));

        // ───────────────────────────────────────────────
        // 7. Activity Feed (trainer dashboards)
        // ───────────────────────────────────────────────
        activityLogRepository.saveAll(List.of(
                ActivityLog.builder().title("Ranuthi logged bench press — 75 kg").color("blue").displayTime("Today, 8:45 AM").build(),
                ActivityLog.builder().title("Nimal completed the Beginner Full Body plan for the week").color("green").displayTime("Yesterday").build(),
                ActivityLog.builder().title("Kavya logged a 25-minute treadmill session").color("blue").displayTime("2 days ago").build(),
                ActivityLog.builder().title("Saman has a new plan assigned: Weight Loss Circuit").color("yellow").displayTime("3 days ago").build()
        ));

        
        // ───────────────────────────────────────────────
        // 10. Notifications (every member gets some, so no
        //     one's inbox is empty in the demo)
        // ───────────────────────────────────────────────
        notificationRepository.saveAll(List.of(
                Notification.builder().user(member1).title("New Personal Record!").message("Congratulations! You hit a new PR on Bench Press: 75 kg.").type(Notification.NotificationType.WORKOUT_LOGGED).isRead(false).build(),
                Notification.builder().user(member1).title("Membership Active").message("Your Monthly Plan payment of Rs. 2,500 was processed successfully.").type(Notification.NotificationType.PAYMENT).isRead(true).build(),

                Notification.builder().user(member2).title("New workout plan assigned").message("Kasun has assigned you a new plan: Beginner Full Body.").type(Notification.NotificationType.WORKOUT_ASSIGNED).isRead(false).build(),
                Notification.builder().user(member2).title("Membership Expiring Soon").message("Your Monthly Plan expires in 3 days — renew now to avoid interruption.").type(Notification.NotificationType.PAYMENT).isRead(false).build(),

                Notification.builder().user(member3).title("Workout Reminder").message("Your Core & Mobility session is scheduled for today.").type(Notification.NotificationType.WORKOUT_ASSIGNED).isRead(false).build(),

                Notification.builder().user(member4).title("Membership Expired").message("Your Monthly Plan has expired. Renew to restore full access.").type(Notification.NotificationType.PAYMENT).isRead(false).build(),
                Notification.builder().user(member4).title("New workout plan assigned").message("Ruwan has assigned you a new plan: Weight Loss Circuit.").type(Notification.NotificationType.WORKOUT_ASSIGNED).isRead(true).build()
        ));
    }

    // ───────────────────────────────────────────────
    // Backfill: Recent activity (trainer dashboard) +
    // Exercise progress (monitor progress page)
    // ───────────────────────────────────────────────
    private void seedActivityAndProgressIfMissing() {
        // Look up the demo members/exercises that seedCoreData() creates.
        // If any are missing (different data set), just skip quietly.
        var member1 = userRepository.findByEmail("ranuthi@fittrack.com").orElse(null);
        var member2 = userRepository.findByEmail("nimal@fittrack.com").orElse(null);
        var member3 = userRepository.findByEmail("kavya@fittrack.com").orElse(null);
        var member4 = userRepository.findByEmail("saman@fittrack.com").orElse(null);

        var benchPress = exerciseRepository.findFirstByExerciseNameIgnoreCase("Barbell Bench Press").orElse(null);
        var deadlift = exerciseRepository.findFirstByExerciseNameIgnoreCase("Barbell Deadlift").orElse(null);
        var squat = exerciseRepository.findFirstByExerciseNameIgnoreCase("Barbell Back Squat").orElse(null);
        var treadmillRun = exerciseRepository.findFirstByExerciseNameIgnoreCase("Treadmill Interval Run").orElse(null);
        var plank = exerciseRepository.findFirstByExerciseNameIgnoreCase("Plank").orElse(null);

        if (progressLogRepository.count() == 0
                && member1 != null && member2 != null && member3 != null && member4 != null
                && benchPress != null && deadlift != null && squat != null && treadmillRun != null && plank != null) {

            progressLogRepository.saveAll(List.of(
                    ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("70.0")).repsDone(8).loggedDate(LocalDate.now().minusDays(12)).build(),
                    ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("72.5")).repsDone(8).loggedDate(LocalDate.now().minusDays(7)).build(),
                    ProgressLog.builder().member(member1).exercise(benchPress).weightKg(new BigDecimal("75.0")).repsDone(6).loggedDate(LocalDate.now().minusDays(2)).build(),
                    ProgressLog.builder().member(member1).exercise(deadlift).weightKg(new BigDecimal("110.0")).repsDone(5).loggedDate(LocalDate.now().minusDays(5)).build(),
                    ProgressLog.builder().member(member1).exercise(squat).weightKg(new BigDecimal("95.0")).repsDone(8).loggedDate(LocalDate.now().minusDays(1)).build(),

                    ProgressLog.builder().member(member2).exercise(squat).weightKg(new BigDecimal("50.0")).repsDone(10).loggedDate(LocalDate.now().minusDays(9)).build(),
                    ProgressLog.builder().member(member2).exercise(benchPress).weightKg(new BigDecimal("40.0")).repsDone(10).loggedDate(LocalDate.now().minusDays(4)).build(),

                    ProgressLog.builder().member(member3).exercise(treadmillRun).weightKg(null).repsDone(null).loggedDate(LocalDate.now().minusDays(6)).build(),
                    ProgressLog.builder().member(member3).exercise(plank).weightKg(null).repsDone(1).loggedDate(LocalDate.now().minusDays(3)).build(),

                    ProgressLog.builder().member(member4).exercise(squat).weightKg(new BigDecimal("45.0")).repsDone(12).loggedDate(LocalDate.now().minusDays(2)).build()
            ));
        }

        if (activityLogRepository.count() == 0) {
            activityLogRepository.saveAll(List.of(
                    ActivityLog.builder().title("Ranuthi logged bench press — 75 kg").color("blue").displayTime("Today, 8:45 AM").build(),
                    ActivityLog.builder().title("Nimal completed the Beginner Full Body plan for the week").color("green").displayTime("Yesterday").build(),
                    ActivityLog.builder().title("Kavya logged a 25-minute treadmill session").color("blue").displayTime("2 days ago").build(),
                    ActivityLog.builder().title("Saman has a new plan assigned: Weight Loss Circuit").color("yellow").displayTime("3 days ago").build()
            ));
        }
    }
}
