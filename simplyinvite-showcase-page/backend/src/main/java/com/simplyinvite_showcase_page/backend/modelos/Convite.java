package com.simplyinvite_showcase_page.backend.modelos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "convites")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Convite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente; // Pode ser RH ou Gestor

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario; // Deve ser um Talento

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projeto_id", nullable = true) // Convite pode ou não estar ligado a um projeto
    private Projeto projeto;

    @Lob
    @Column(nullable = false)
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConvite status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataEnvio;

    private LocalDateTime dataResposta;
} 