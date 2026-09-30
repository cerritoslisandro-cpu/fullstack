package com.ejemplo;

import io.smallrye.jwt.build.Jwt;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashSet;
import java.util.Arrays;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResources {

    @POST
    @Path("/login")
    public Response login(AuthRequest request) {
        if ("admin".equals(request.username()) && "123456".equals(request.password())) {
            String token = Jwt.issuer("https://fullstack.app/issuer")
                    .upn(request.username())
                    .groups(new HashSet<>(Arrays.asList("User", "Admin")))
                    .expiresIn(3600)
                    .sign();

            return Response.ok(new AuthResponse(token)).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }
}

record AuthRequest(String username, String password) {}
record AuthResponse(String token) {}
