package com.fittrack.backend.controller;

import com.fittrack.backend.dto.MembershipResponse;
import com.fittrack.backend.model.User;
import com.fittrack.backend.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    // GET /api/membership/my
    @GetMapping("/my")
    public ResponseEntity<MembershipResponse> getMyMembership(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(membershipService.getMyMembership(user));
    }

    // GET /api/membership/payments
    @GetMapping("/payments")
    public ResponseEntity<List<MembershipResponse>> getPaymentHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(membershipService.getPaymentHistory(user));
    }

    // POST /api/membership/renew
    @PostMapping("/renew")
    public ResponseEntity<MembershipResponse> renew(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(membershipService.renewMembership(user, body.get("planType")));
    }
}
