# RoundRobin
This is a service for a Round Robin-based coupon claiming system using Node.js, Express, MongoDB, and Mongoose. Users can claim coupons with IP and device-based cooldown restrictions.
live url: https://round-robin-psi.vercel.app/


📌 Features

Round Robin Coupon Distribution: Ensures fair coupon allocation.

Rate Limiting: Prevents frequent claims from the same IP or device.

MongoDB Atlas Integration: Stores claim history and coupon data.

Cookies for Device Tracking: Uses deviceId stored in cookies.

 <h1>how abuse prevention Mechanism works</h1>
- **IP Tracking:** Stores the user's IP into the database and restricts claims within 1 hour for the same ip address.

- **Cookie Tracking:** Assigns a `deviceId` to prevent multiple claims from the same browser.
 
- **Round-Robin Distribution:** Ensures fair coupon assignment to users.

