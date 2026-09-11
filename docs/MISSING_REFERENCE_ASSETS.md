# Referências propositalmente ausentes

A documentação mestre cita elementos que não estão incluídos neste pacote. O Work não deve inventá-los como se fossem definitivos.

Ausentes ou ainda não fechados:

- referências visuais `RV-XX` e pasta `referencias/` citadas na documentação mestre;
- identidade visual final;
- paleta final;
- tipografia final;
- símbolo/logo final;
- fotografias licenciadas reais;
- mapa vetorial definitivo de Serra Negra;
- implementação oficial do motor visual de carimbos, embora a documentação informe que o carimbo já foi desenvolvido;
- credenciais de Google Maps, clima, Clerk ou serviços externos.

## Tratamento

- usar placeholders neutros;
- usar mocks determinísticos para providers externos;
- não redesenhar o carimbo: criar apenas um `StampRenderer`/placeholder substituível;
- não interpretar ausência de referência como autorização para inventar identidade visual;
- registrar qualquer suposição técnica em `docs/decisions/`.
