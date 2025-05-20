package com.simplyinvite_showcase_page.backend.seguranca;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SegurancaConfig {
    @Autowired
    private JwtFiltro jwtFiltro;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/usuarios").permitAll() // Permitir login e registro
                .requestMatchers("/api/**").authenticated()                 // Exigir autenticação para o resto da API
                .anyRequest().permitAll()                                  // Manter permitAll para outras requisições não /api por enquanto
            );
        // Remover filtro JWT temporariamente para não bloquear nada -> Reativar filtro
        http.addFilterBefore(jwtFiltro, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
