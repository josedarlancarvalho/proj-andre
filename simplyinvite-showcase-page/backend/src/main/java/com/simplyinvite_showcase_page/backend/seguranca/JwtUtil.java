package com.simplyinvite_showcase_page.backend.seguranca;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

public class JwtUtil {
    // private static final String SECRET_KEY_STRING = "segredosimplyinvitecomsegurancaextrema"; // String antiga não usada mais
    // Gerar uma chave segura para HS512. Esta chave será gerada uma vez quando a classe for carregada.
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final long EXPIRATION_TIME_MS = 86400000; // 1 dia em ms

    // Helper para extrair todas as claims
    private static Claims extrairTodasClaims(String token) {
        // Para parsear, precisamos da mesma chave usada para assinar.
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }

    // Helper para extrair uma claim específica
    public static <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extrairTodasClaims(token);
        return claimsResolver.apply(claims);
    }

    public static String getEmailDoToken(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public static String getTipoPerfilDoToken(String token) {
        return extrairClaim(token, claims -> (String) claims.get("tipoPerfil"));
    }

    private static Date extrairDataExpiracao(String token) {
        return extrairClaim(token, Claims::getExpiration);
    }

    private static Boolean isTokenExpirado(String token) {
        return extrairDataExpiracao(token).before(new Date());
    }

    public static String gerarToken(UserDetails userDetails) {
        // Assume que userDetails.getUsername() retorna o email
        // Para pegar tipoPerfil, precisamos que nosso UserDetails (Usuario) tenha um método getTipoPerfil()
        // ou que passemos o tipoPerfil explicitamente aqui.
        // Por simplicidade, se UserDetails for nossa classe Usuario, podemos fazer um cast.
        String tipoPerfil = "";
        if (userDetails instanceof com.simplyinvite_showcase_page.backend.modelos.Usuario) {
            tipoPerfil = ((com.simplyinvite_showcase_page.backend.modelos.Usuario) userDetails).getTipoPerfil();
        }

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // Email
                .claim("tipoPerfil", tipoPerfil) // Adiciona o tipo de perfil como claim
                // Adicionar authorities/roles se necessário nas claims, embora já estejam em UserDetails
                // .claim("roles", userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512) // Usar a Key e o algoritmo
                .compact();
    }
    
    // Método antigo, pode ser removido ou mantido para uso interno se necessário sem UserDetails
    /* 
    public static String gerarToken(String email, String tipoPerfil) {
        return Jwts.builder()
                .setSubject(email)
                .claim("tipoPerfil", tipoPerfil)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
    */

    public static Boolean validarToken(String token, UserDetails userDetails) {
        final String usernameDoToken = getEmailDoToken(token);
        return (usernameDoToken.equals(userDetails.getUsername()) && !isTokenExpirado(token));
    }

    // Método de validação original (apenas assinatura e expiração), pode ser privado ou removido se não usado externamente
    /*
    public static boolean validarToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    */
}
