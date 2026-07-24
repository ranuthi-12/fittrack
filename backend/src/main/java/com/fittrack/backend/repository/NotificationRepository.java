package com.fittrack.backend.repository;

import com.fittrack.backend.model.Notification;
import com.fittrack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    long countByUserAndIsReadFalse(User user);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user")
    void markAllAsReadByUser(User user);
}
