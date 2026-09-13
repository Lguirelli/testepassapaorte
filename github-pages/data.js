window.PSN_DATA = {
  "content": {
    "meta": {
      "dataset": "Passaporte Serra Negra Validation v1",
      "synthetic": true,
      "warning": "Todos os dados são fictícios e destinados exclusivamente à validação do software.",
      "demoClock": "2026-09-12T09:00:00-03:00"
    },
    "city": {
      "id": "city-demo-serra-negra",
      "name": "Serra Negra",
      "state": "SP",
      "country": "BR",
      "isDemoContext": true
    },
    "categories": [
      {
        "id": "cat-natureza",
        "slug": "natureza",
        "name": "Natureza",
        "icon": "explorar",
        "enabled": true,
        "sortOrder": 10
      },
      {
        "id": "cat-gastronomia",
        "slug": "gastronomia",
        "name": "Gastronomia",
        "icon": "lugar-informacao",
        "enabled": true,
        "sortOrder": 20
      },
      {
        "id": "cat-cafes",
        "slug": "cafes",
        "name": "Cafés",
        "icon": "lugar-informacao",
        "enabled": true,
        "sortOrder": 30
      },
      {
        "id": "cat-cultura",
        "slug": "cultura",
        "name": "Cultura",
        "icon": "passaporte-categorias",
        "enabled": true,
        "sortOrder": 40
      },
      {
        "id": "cat-compras",
        "slug": "compras",
        "name": "Compras locais",
        "icon": "parceiros",
        "enabled": true,
        "sortOrder": 50
      },
      {
        "id": "cat-bem-estar",
        "slug": "bem-estar",
        "name": "Bem-estar",
        "icon": "passaporte-descobertas",
        "enabled": true,
        "sortOrder": 60
      }
    ],
    "places": [
      {
        "id": "place-mirante-araucarias",
        "slug": "mirante-vale-das-araucarias",
        "name": "Mirante Vale das Araucárias",
        "placeType": "tourist_point",
        "commercialRelation": "public_point",
        "categoryIds": [
          "cat-natureza"
        ],
        "shortDescription": "Mirante fictício criado para validar páginas de ponto turístico, clima e recomendações próximas.",
        "longDescription": "Conteúdo de demonstração. O local não representa um ponto real e deve permanecer claramente identificado como fictício durante toda a validação.",
        "environment": "outdoor",
        "costType": "free",
        "durationMinutes": 75,
        "accessibility": [
          "partial"
        ],
        "openingHours": {
          "type": "demo",
          "text": "08:00–18:00"
        },
        "location": {
          "lat": -22.6121,
          "lng": -46.7015,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "landscape-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/01-mirante-vale-araucarias.jpg",
          "fallbackSrc": "assets/stock/01-mirante-vale-araucarias.jpg",
          "sourcePage": "https://www.pexels.com/photo/scenic-mountain-view-in-minas-gerais-brazil-34077879/",
          "author": "Malcoln Oliveira",
          "provider": "Pexels",
          "alt": "Paisagem montanhosa em Minas Gerais, usada como foto ilustrativa",
          "position": "center 48%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-jardim-nascentes",
        "slug": "jardim-das-nascentes",
        "name": "Jardim das Nascentes",
        "placeType": "tourist_point",
        "commercialRelation": "public_point",
        "categoryIds": [
          "cat-natureza"
        ],
        "shortDescription": "Parque fictício usado para validar filtros outdoor, atividades sem custo e calendário.",
        "environment": "outdoor",
        "costType": "free",
        "durationMinutes": 90,
        "openingHours": {
          "type": "demo",
          "text": "07:00–17:30"
        },
        "location": {
          "lat": -22.616,
          "lng": -46.695,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "landscape-02",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/02-jardim-nascentes.jpg",
          "fallbackSrc": "assets/stock/02-jardim-nascentes.jpg",
          "sourcePage": "https://www.pexels.com/photo/tropical-garden-pathway-in-parana-brazil-36949609/",
          "author": "Silas Guadagnini",
          "provider": "Pexels",
          "alt": "Caminho em jardim tropical no Brasil, usado como foto ilustrativa",
          "position": "center 55%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-centro-cultural",
        "slug": "centro-cultural-estacao-da-serra",
        "name": "Centro Cultural Estação da Serra",
        "placeType": "tourist_point",
        "commercialRelation": "public_point",
        "categoryIds": [
          "cat-cultura"
        ],
        "shortDescription": "Espaço cultural fictício usado para validar conteúdo indoor, eventos e páginas editoriais.",
        "environment": "indoor",
        "costType": "free",
        "durationMinutes": 60,
        "openingHours": {
          "type": "demo",
          "text": "10:00–18:00"
        },
        "location": {
          "lat": -22.614,
          "lng": -46.699,
          "display": "Área central de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "architecture-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/03-centro-cultural.jpg",
          "fallbackSrc": "assets/stock/03-centro-cultural.jpg",
          "sourcePage": "https://pixabay.com/photos/museum-building-interior-windows-5731683/",
          "author": "akagi99",
          "provider": "Pixabay",
          "alt": "Interior monumental de museu histórico, usado como foto ilustrativa",
          "position": "center 45%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-cafe-neblina",
        "slug": "cafe-neblina-alta",
        "name": "Café Neblina Alta",
        "placeType": "business",
        "commercialRelation": "partner",
        "partnerId": "partner-cafe-neblina",
        "categoryIds": [
          "cat-cafes",
          "cat-gastronomia"
        ],
        "shortDescription": "Café parceiro fictício criado para validar página comercial, contato, roteiro e analytics do parceiro.",
        "environment": "indoor",
        "costType": "paid",
        "durationMinutes": 60,
        "openingHours": {
          "type": "demo",
          "text": "08:00–19:00"
        },
        "location": {
          "lat": -22.6132,
          "lng": -46.7001,
          "display": "Área central de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "cafe-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/04-cafe-neblina-alta.jpg",
          "fallbackSrc": "assets/stock/04-cafe-neblina-alta.jpg",
          "sourcePage": "https://www.pexels.com/photo/cozy-cafe-interior-design-8847017/",
          "author": "Sveta K",
          "provider": "Pexels",
          "alt": "Interior aconchegante de café, usado como foto ilustrativa",
          "position": "center 55%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-bistro-estacao",
        "slug": "bistro-estacao-verde",
        "name": "Bistrô Estação Verde",
        "placeType": "business",
        "commercialRelation": "partner",
        "partnerId": "partner-bistro-estacao",
        "categoryIds": [
          "cat-gastronomia"
        ],
        "shortDescription": "Restaurante fictício para testar horários, contato externo e recomendação contextual de almoço.",
        "environment": "indoor",
        "costType": "paid",
        "durationMinutes": 90,
        "openingHours": {
          "type": "demo",
          "text": "11:30–22:00"
        },
        "location": {
          "lat": -22.6109,
          "lng": -46.6972,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "restaurant-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/05-bistro-estacao-verde.jpg",
          "fallbackSrc": "assets/stock/05-bistro-estacao-verde.jpg",
          "sourcePage": "https://www.pexels.com/photo/restaurant-interior-19039292/",
          "author": "Orhan Pergel",
          "provider": "Pexels",
          "alt": "Interior de restaurante com luz quente, usado como foto ilustrativa",
          "position": "center 52%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-atelie-pedra-folha",
        "slug": "atelie-pedra-e-folha",
        "name": "Ateliê Pedra & Folha",
        "placeType": "business",
        "commercialRelation": "partner",
        "partnerId": "partner-atelie-pedra-folha",
        "categoryIds": [
          "cat-cultura",
          "cat-compras"
        ],
        "shortDescription": "Ateliê fictício para validar experiências com reserva, conteúdo editorial e parceria.",
        "environment": "indoor",
        "costType": "mixed",
        "durationMinutes": 75,
        "openingHours": {
          "type": "demo",
          "text": "09:30–18:00"
        },
        "location": {
          "lat": -22.615,
          "lng": -46.703,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "craft-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/06-atelie-pedra-folha.jpg",
          "fallbackSrc": "assets/stock/06-atelie-pedra-folha.jpg",
          "sourcePage": "https://www.pexels.com/photo/pottery-standing-on-a-shelf-in-ceramics-studio-15440780/",
          "author": "Oleg Prachuk",
          "provider": "Pexels",
          "alt": "Peças de cerâmica artesanal em estúdio, usadas como foto ilustrativa",
          "position": "center 46%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-casa-mel",
        "slug": "casa-do-mel-da-serra",
        "name": "Casa do Mel da Serra",
        "placeType": "business",
        "commercialRelation": "partner",
        "partnerId": "partner-casa-mel",
        "categoryIds": [
          "cat-compras",
          "cat-gastronomia"
        ],
        "shortDescription": "Produtor fictício usado para validar descoberta de produtos locais e retorno registrado.",
        "environment": "mixed",
        "costType": "mixed",
        "durationMinutes": 60,
        "openingHours": {
          "type": "demo",
          "text": "09:00–17:00"
        },
        "location": {
          "lat": -22.619,
          "lng": -46.704,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "producer-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/07-casa-mel-serra.jpg",
          "fallbackSrc": "assets/stock/07-casa-mel-serra.jpg",
          "sourcePage": "https://www.pexels.com/photo/artisanal-honey-jars-with-honeycomb-outdoors-35042437/",
          "author": "Mykhailo Kaparchuk",
          "provider": "Pexels",
          "alt": "Potes de mel artesanal e favos ao ar livre, usados como foto ilustrativa",
          "position": "center 48%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      },
      {
        "id": "place-aguas-claras",
        "slug": "espaco-bem-estar-aguas-claras",
        "name": "Espaço Bem-Estar Águas Claras",
        "placeType": "business",
        "commercialRelation": "partner",
        "partnerId": "partner-aguas-claras",
        "categoryIds": [
          "cat-bem-estar"
        ],
        "shortDescription": "Espaço de bem-estar fictício para validar reserva externa e experiências com duração própria.",
        "environment": "indoor",
        "costType": "paid_with_booking",
        "durationMinutes": 90,
        "openingHours": {
          "type": "demo",
          "text": "10:00–20:00"
        },
        "location": {
          "lat": -22.6088,
          "lng": -46.702,
          "display": "Área de demonstração, Serra Negra, SP"
        },
        "imagePlaceholder": "wellness-01",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ],
        "imageAsset": {
          "src": "assets/stock/08-bem-estar-aguas-claras.jpg",
          "fallbackSrc": "assets/stock/08-bem-estar-aguas-claras.jpg",
          "sourcePage": "https://www.pexels.com/photo/interior-of-a-massage-room-7598366/",
          "author": "Max Vakhtbovych",
          "provider": "Pexels",
          "alt": "Ambiente de massagem e bem-estar, usado como foto ilustrativa",
          "position": "center 50%",
          "illustrative": true,
          "notActualPlace": true
        
        }
      }
    ],
    "partners": [
      {
        "id": "partner-cafe-neblina",
        "placeId": "place-cafe-neblina",
        "status": "active",
        "responseTime": "within_1_hour",
        "demoContacts": {
          "whatsapp": "+55 00 00000-0001",
          "phone": "+55 00 0000-0001",
          "instagram": "@demo_cafe_neblina",
          "website": "https://example.invalid/cafe-neblina"
        }
      },
      {
        "id": "partner-bistro-estacao",
        "placeId": "place-bistro-estacao",
        "status": "active",
        "responseTime": "same_day",
        "demoContacts": {
          "whatsapp": "+55 00 00000-0002",
          "phone": "+55 00 0000-0002",
          "instagram": "@demo_bistro_estacao",
          "website": "https://example.invalid/bistro-estacao"
        }
      },
      {
        "id": "partner-atelie-pedra-folha",
        "placeId": "place-atelie-pedra-folha",
        "status": "active",
        "responseTime": "within_few_hours",
        "demoContacts": {
          "whatsapp": "+55 00 00000-0003",
          "instagram": "@demo_pedra_folha",
          "website": "https://example.invalid/pedra-folha"
        }
      },
      {
        "id": "partner-casa-mel",
        "placeId": "place-casa-mel",
        "status": "active",
        "responseTime": "same_day",
        "demoContacts": {
          "whatsapp": "+55 00 00000-0004",
          "website": "https://example.invalid/casa-mel"
        }
      },
      {
        "id": "partner-aguas-claras",
        "placeId": "place-aguas-claras",
        "status": "active",
        "responseTime": "within_few_hours",
        "demoContacts": {
          "whatsapp": "+55 00 00000-0005",
          "website": "https://example.invalid/aguas-claras"
        }
      }
    ],
    "experiences": [
      {
        "id": "exp-por-do-sol",
        "slug": "por-do-sol-vale-araucarias",
        "placeId": "place-mirante-araucarias",
        "name": "Pôr do sol no Vale",
        "costType": "free",
        "bookingType": "none",
        "durationMinutes": 60,
        "environment": "outdoor",
        "status": "published"
      },
      {
        "id": "exp-caminhada-nascentes",
        "slug": "caminhada-nascentes",
        "placeId": "place-jardim-nascentes",
        "name": "Caminhada pelas nascentes",
        "costType": "free",
        "bookingType": "none",
        "durationMinutes": 75,
        "environment": "outdoor",
        "status": "published"
      },
      {
        "id": "exp-cafe-metodos",
        "slug": "cafes-da-serra-metodos",
        "placeId": "place-cafe-neblina",
        "name": "Cafés da serra e métodos",
        "costType": "paid",
        "bookingType": "external_optional",
        "durationMinutes": 50,
        "environment": "indoor",
        "status": "published"
      },
      {
        "id": "exp-oficina-folhas",
        "slug": "oficina-pedra-e-folha",
        "placeId": "place-atelie-pedra-folha",
        "name": "Oficina Pedra & Folha",
        "costType": "paid_with_booking",
        "bookingType": "external_required",
        "durationMinutes": 90,
        "environment": "indoor",
        "status": "published"
      },
      {
        "id": "exp-almoco-estacao",
        "slug": "almoco-estacao-verde",
        "placeId": "place-bistro-estacao",
        "name": "Almoço Estação Verde",
        "costType": "paid",
        "bookingType": "external_optional",
        "durationMinutes": 90,
        "environment": "indoor",
        "status": "published"
      },
      {
        "id": "exp-rota-mel",
        "slug": "rota-do-mel-local",
        "placeId": "place-casa-mel",
        "name": "Rota do mel local",
        "costType": "mixed",
        "bookingType": "none",
        "durationMinutes": 60,
        "environment": "mixed",
        "status": "published"
      },
      {
        "id": "exp-relaxamento",
        "slug": "sessao-aguas-claras",
        "placeId": "place-aguas-claras",
        "name": "Sessão Águas Claras",
        "costType": "paid_with_booking",
        "bookingType": "external_required",
        "durationMinutes": 90,
        "environment": "indoor",
        "status": "published"
      }
    ],
    "events": [
      {
        "id": "event-feira-criativa",
        "slug": "feira-criativa-da-serra-demo",
        "name": "Feira Criativa da Serra — DEMO",
        "placeId": "place-centro-cultural",
        "startsAt": "2026-09-12T10:00:00-03:00",
        "endsAt": "2026-09-12T17:00:00-03:00",
        "costType": "free",
        "environment": "indoor",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ]
      },
      {
        "id": "event-musica-jardim",
        "slug": "musica-no-jardim-demo",
        "name": "Música no Jardim — DEMO",
        "placeId": "place-jardim-nascentes",
        "startsAt": "2026-09-13T15:00:00-03:00",
        "endsAt": "2026-09-13T17:00:00-03:00",
        "costType": "free",
        "environment": "outdoor",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ]
      },
      {
        "id": "event-produtores",
        "slug": "encontro-produtores-locais-demo",
        "name": "Encontro de Produtores Locais — DEMO",
        "placeId": "place-casa-mel",
        "startsAt": "2026-09-19T09:00:00-03:00",
        "endsAt": "2026-09-19T14:00:00-03:00",
        "costType": "free",
        "environment": "mixed",
        "status": "published",
        "sourceIds": [
          "source-synthetic"
        ]
      }
    ],
    "sources": [
      {
        "id": "source-synthetic",
        "sourceName": "Dataset sintético de validação",
        "sourceType": "synthetic_validation",
        "sourceUrl": null,
        "verificationStatus": "demo_only",
        "verifiedAt": "2026-09-09T00:00:00-03:00",
        "notes": "Não corresponde a fonte pública nem a estabelecimento real."
      }
    ]
  },
  "trip": {
    "trip": {
      "id": "demo-trip-001",
      "synthetic": true,
      "cityId": "city-demo-serra-negra",
      "startsOn": "2026-09-12",
      "endsOn": "2026-09-14",
      "party": "couple",
      "pace": "balanced",
      "transport": "car",
      "interests": [
        "cat-natureza",
        "cat-gastronomia",
        "cat-cultura"
      ],
      "intentions": [
        "conhecer os clássicos",
        "comer bem",
        "ver paisagens"
      ]
    },
    "days": [
      {
        "date": "2026-09-12",
        "items": [
          {
            "id": "trip-item-001",
            "placeId": "place-mirante-araucarias",
            "startsAt": "09:00",
            "durationMinutes": 75,
            "source": "recommended_by_engine",
            "state": "planned"
          },
          {
            "id": "trip-item-002",
            "placeId": "place-cafe-neblina",
            "startsAt": "11:00",
            "durationMinutes": 60,
            "source": "recommended_by_engine",
            "state": "planned"
          },
          {
            "id": "trip-item-003",
            "placeId": "place-centro-cultural",
            "startsAt": "14:00",
            "durationMinutes": 90,
            "source": "recommended_by_engine",
            "state": "planned"
          }
        ]
      },
      {
        "date": "2026-09-13",
        "items": [
          {
            "id": "trip-item-004",
            "placeId": "place-jardim-nascentes",
            "startsAt": "09:00",
            "durationMinutes": 90,
            "source": "recommended_by_engine",
            "state": "planned"
          },
          {
            "id": "trip-item-005",
            "placeId": "place-bistro-estacao",
            "startsAt": "12:00",
            "durationMinutes": 90,
            "source": "added_by_user",
            "state": "fixed"
          },
          {
            "id": "trip-item-006",
            "placeId": "place-atelie-pedra-folha",
            "startsAt": "15:00",
            "durationMinutes": 90,
            "source": "recommended_by_engine",
            "state": "planned"
          }
        ]
      },
      {
        "date": "2026-09-14",
        "items": [
          {
            "id": "trip-item-007",
            "placeId": "place-casa-mel",
            "startsAt": "09:30",
            "durationMinutes": 60,
            "source": "recommended_by_engine",
            "state": "planned"
          },
          {
            "id": "trip-item-008",
            "placeId": "place-aguas-claras",
            "startsAt": "14:00",
            "durationMinutes": 90,
            "source": "recommended_by_engine",
            "state": "planned"
          }
        ]
      }
    ],
    "visits": [
      {
        "id": "visit-demo-001",
        "placeId": "place-mirante-araucarias",
        "occurredAt": "2026-09-12T10:05:00-03:00",
        "evidence": "qr_demo",
        "tripId": "demo-trip-001",
        "isReturn": false
      },
      {
        "id": "visit-demo-002",
        "placeId": "place-cafe-neblina",
        "occurredAt": "2026-09-12T11:42:00-03:00",
        "evidence": "qr_demo",
        "tripId": "demo-trip-001",
        "isReturn": false
      },
      {
        "id": "visit-demo-003",
        "placeId": "place-casa-mel",
        "occurredAt": "2026-09-12T16:10:00-03:00",
        "evidence": "qr_demo",
        "tripId": "demo-trip-001",
        "isReturn": false,
        "outsidePlannedRoute": true
      }
    ],
    "weather": [
      {
        "date": "2026-09-12",
        "condition": "partly_cloudy",
        "temperatureC": 23,
        "rainProbability": 20,
        "demo": true
      },
      {
        "date": "2026-09-13",
        "condition": "rain",
        "temperatureC": 19,
        "rainProbability": 75,
        "demo": true
      },
      {
        "date": "2026-09-14",
        "condition": "clear",
        "temperatureC": 25,
        "rainProbability": 10,
        "demo": true
      }
    ]
  }
};
