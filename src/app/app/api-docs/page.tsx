"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  FileJson, 
  Users, 
  Package, 
  ArrowRight, 
  ArrowLeft, 
  Database,
  Code2,
  AlertCircle,
  Scroll,
  BookText,
  Skull,
  Sparkles,
  Book,
  Pin
} from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-foreground">
            API Documentation
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Guia completa para implementar los endpoints del Codex Arcanum
          </p>
        </div>

        <Separator />

        {/* Overview */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Resumen de Entidades
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Characters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Personajes jugables con stats, inventario personal y oro
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  SharedInventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Items compartidos del grupo (loot, recursos, quest items)
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <BookText className="h-4 w-4" />
                  Lexicon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Interpretaciones de simbolos arcanos
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  NoticeBoard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Misiones, anuncios y noticias del mundo
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Skull className="h-4 w-4" />
                  Bestiary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Criaturas encontradas con stats de combate
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Pantheon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Deidades mayores y menores del mundo
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Chronicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Arcos de historia y sesiones con secretos
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Type Definitions */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Definiciones de Tipos
          </h2>

          <Tabs defaultValue="character" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="character" className="font-mono text-xs">Character</TabsTrigger>
              <TabsTrigger value="stats" className="font-mono text-xs">Stats</TabsTrigger>
              <TabsTrigger value="inventory" className="font-mono text-xs">InventoryItem</TabsTrigger>
              <TabsTrigger value="shared" className="font-mono text-xs">SharedItem</TabsTrigger>
              <TabsTrigger value="lexicon" className="font-mono text-xs">Interpretation</TabsTrigger>
              <TabsTrigger value="notice" className="font-mono text-xs">Notice</TabsTrigger>
              <TabsTrigger value="creature" className="font-mono text-xs">Creature</TabsTrigger>
              <TabsTrigger value="deity" className="font-mono text-xs">Deity</TabsTrigger>
              <TabsTrigger value="chronicle" className="font-mono text-xs">StoryArc</TabsTrigger>
            </TabsList>

            <TabsContent value="character" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">Character</CardTitle>
                  <CardDescription>Estructura completa de un personaje jugable</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`interface Character {
  // Identificadores
  id: string           // UUID del personaje (ej: "p-1")
  ownerId: string      // UUID del usuario dueño (ej: "u-1")
  
  // Info basica
  name: string         // Nombre del personaje
  class: string        // Clase (ej: "Paladin", "Ranger", "Sorcerer", "Fighter")
  level: number        // Nivel del personaje (1-20)
  
  // Puntos de vida
  hp: {
    current: number    // HP actual
    max: number        // HP maximo
  }
  
  // Stats de habilidad
  stats: CharacterStats
  
  // Sistema de juego
  influence: number    // Influencia en la campana (0-100)
  gold: number         // Oro personal (puede ser NEGATIVO para deudas)
  
  // Estado actual
  status: "Active" | "Wounded" | "Unconscious"
  
  // Inventario personal
  personalItems: InventoryItem[]
}`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">CharacterStats</CardTitle>
                  <CardDescription>Atributos de habilidad del personaje (D&D style)</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface CharacterStats {
  str: number  // Fuerza (1-30)
  dex: number  // Destreza (1-30)
  con: number  // Constitucion (1-30)
  int: number  // Inteligencia (1-30)
  wis: number  // Sabiduria (1-30)
  cha: number  // Carisma (1-30)
}

// Ejemplo:
{
  str: 18,
  dex: 10,
  con: 16,
  int: 10,
  wis: 14,
  cha: 16
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">InventoryItem</CardTitle>
                  <CardDescription>Item del inventario personal de un personaje</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface InventoryItem {
  id: string        // UUID del item (ej: "i-1")
  name: string      // Nombre del item
  quantity: number  // Cantidad (>= 0)
  type: "weapon" | "armor" | "consumable" | "quest" | "misc"
}

// Ejemplos:
{ id: "i-1", name: "Holy Symbol of Aethon", quantity: 1, type: "misc" }
{ id: "i-3", name: "Quiver of Endless Arrows", quantity: 1, type: "weapon" }
{ id: "i-5", name: "Staff of Thunder", quantity: 1, type: "weapon" }`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shared" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">SharedItem</CardTitle>
                  <CardDescription>Item del inventario compartido del grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface SharedItem {
  id: string      // UUID del item (ej: "s-1")
  name: string    // Nombre del item
  quantity: number // Cantidad
  type: "Currency" | "Magic Item" | "Consumable" | "Quest Item" | "Resource"
  icon: string    // Nombre del icono (lucide-react)
  fixed?: boolean // Si true, no se puede eliminar (ej: Gold Pieces)
}

// Iconos disponibles: "coins", "backpack", "flask", "key", 
//                     "sword", "scroll", "apple", "link", "gem"

// Ejemplos:
{ id: "s-1", name: "Gold Pieces", quantity: 2340, type: "Currency", icon: "coins", fixed: true }
{ id: "s-3", name: "Health Potions", quantity: 5, type: "Consumable", icon: "flask" }
{ id: "s-4", name: "Obsidian Key", quantity: 1, type: "Quest Item", icon: "key" }`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lexicon" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">Interpretation</CardTitle>
                  <CardDescription>Traduccion de simbolos arcanos en el Lexicon</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface Interpretation {
  id: string              // UUID de la interpretacion
  symbolSequence: string  // Secuencia de simbolos (ej: "KHM", "VRX", "ZTHAAL")
  userDefinition: string  // Significado que el usuario asigna
  notes?: string          // Notas opcionales sobre donde se encontro
  discoveryDate: string   // Fecha de descubrimiento (ISO format: "2024-03-20")
}

// Ejemplos:
{
  id: "1",
  symbolSequence: "KHM",
  userDefinition: "Danger/Blood",
  notes: "Found inscribed on the cultist altar in Thornmere",
  discoveryDate: "2024-03-20"
}
{
  id: "2",
  symbolSequence: "VRX",
  userDefinition: "World Tree",
  notes: "Repeated in the elven ruins",
  discoveryDate: "2024-03-22"
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notice" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">Notice</CardTitle>
                  <CardDescription>Avisos del tablero de anuncios</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface Notice {
  id: string
  type: "mission" | "ad" | "news"  // Tipo de aviso (mision, anuncio, noticia)
  title: string                     // Titulo del aviso
  content: string                   // Contenido completo del aviso
  position: {                       // Posicion en el tablero (desktop)
    x: number                       // Posicion X en pixeles
    y: number                       // Posicion Y en pixeles
  }
  rotation: number                  // Rotacion en grados (-5 a 5 recomendado)
}

// Ejemplo:
{
  id: "1",
  type: "mission",
  title: "The Silent Woods",
  content: "Reports of strange lights bearing the mark of KHM near the old druid grove...",
  position: { x: 40, y: 30 },
  rotation: -3
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="creature" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">Creature</CardTitle>
                  <CardDescription>Criatura del bestiario con estadisticas de combate</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface Creature {
  id: string
  name: string                      // Nombre de la criatura
  type: "Plant" | "Undead" | "Humanoid" | "Elemental" | 
        "Construct" | "Beast" | "Fiend"
  cr: string                        // Challenge Rating (ej: "3", "1/2", "8")
  hp: string                        // Hit Points (ej: "68", "126")
  ac: string                        // Armor Class (ej: "13", "18")
  vulnerabilities: string           // Vulnerabilidades (ej: "Fire, Slashing")
  description: string               // Descripcion de la criatura
}

// Ejemplo:
{
  id: "b1",
  name: "Thornblight Shambler",
  type: "Plant",
  cr: "3",
  hp: "68",
  ac: "13",
  vulnerabilities: "Fire, Slashing",
  description: "A corrupted plant creature found in Thornmere. Ancient texts refer to it as 'KHM-spawn'..."
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">Deity</CardTitle>
                  <CardDescription>Deidad del Panteon (Greater o Lesser)</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface Deity {
  name: string        // Nombre completo de la deidad
  domain: string      // Dominios separados por coma (ej: "Light, Justice, Protection")
  description: string // Descripcion de la deidad y su culto
  symbol: string      // Descripcion del simbolo sagrado
}

// Ejemplo Greater Deity:
{
  name: "Aethon, The Radiant Warden",
  domain: "Light, Justice, Protection",
  description: "The supreme deity of order and justice. Depicted as a towering figure in golden plate armor with wings of pure light...",
  symbol: "A golden sun behind a raised shield"
}

// Ejemplo Lesser Idol:
{
  name: "Veska, The Trickster",
  domain: "Luck, Mischief, Trade",
  description: "A chaotic spirit worshipped by merchants and thieves alike...",
  symbol: "Two coins spinning in opposite directions"
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chronicle" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-lg">StoryArc & Session</CardTitle>
                  <CardDescription>Arcos de historia y sesiones de juego</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg">
{`interface Session {
  id: string        // UUID de la sesion
  title: string     // Titulo (ej: "Session 1: Whispers in Greyhaven")
  summary: string   // Resumen de lo que paso en la sesion
  secret: string    // Secreto oculto que el DM puede revelar
}

interface StoryArc {
  id: string          // UUID del arco
  title: string       // Titulo del arco (ej: "The Shattered Vigil")
  sessions: Session[] // Array de sesiones en este arco
}

// Ejemplo:
{
  id: "arc-1",
  title: "The Shattered Vigil",
  sessions: [
    {
      id: "s1",
      title: "Session 1: Whispers in Greyhaven",
      summary: "The party met at the Broken Chalice tavern in Greyhaven after each receiving a cryptic summons...",
      secret: "Verath is actually an agent of the Obsidian Crown. His true name is Maltheus..."
    },
    {
      id: "s2",
      title: "Session 2: The Thornmere Descent",
      summary: "Venturing into Thornmere, the party discovered an ancient elven ruin...",
      secret: "The chanting is from the Cult of the Verdant Spiral..."
    }
  ]
}`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* API Endpoints */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Endpoints Requeridos
          </h2>

          {/* Characters Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground mt-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Characters
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/characters</CardTitle>
              </div>
              <CardDescription>Obtener todos los personajes del party</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-mono text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Response
                </h4>
                <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg overflow-x-auto">
{`{
  "characters": Character[]
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">PATCH</Badge>
                <CardTitle className="font-mono text-base">/api/characters/:id</CardTitle>
              </div>
              <CardDescription>Actualizar parcialmente un personaje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-mono text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Request Body
                </h4>
                <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`Partial<Character> // Cualquier campo excepto id y ownerId`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/characters/:id/items</CardTitle>
              </div>
              <CardDescription>Agregar item al inventario personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-mono text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Request Body
                </h4>
                <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "name": string,
  "quantity": number,
  "type": "weapon" | "armor" | "consumable" | "quest" | "misc"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">DELETE</Badge>
                <CardTitle className="font-mono text-base">/api/characters/:characterId/items/:itemId</CardTitle>
              </div>
              <CardDescription>Eliminar item del inventario personal</CardDescription>
            </CardHeader>
          </Card>

          <Separator className="my-6" />

          {/* Shared Inventory Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Shared Inventory
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/shared-inventory</CardTitle>
              </div>
              <CardDescription>Obtener inventario compartido del party</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{ "items": SharedItem[] }`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/shared-inventory</CardTitle>
              </div>
              <CardDescription>Agregar item al inventario compartido</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "name": string,
  "quantity": number,
  "type": "Currency" | "Magic Item" | "Consumable" | "Quest Item" | "Resource",
  "icon": string
}`}
              </pre>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Lexicon Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" />
            Lexicon (Interpretations)
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/lexicon</CardTitle>
              </div>
              <CardDescription>Obtener todas las interpretaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{ "interpretations": Interpretation[] }`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/lexicon</CardTitle>
              </div>
              <CardDescription>Agregar nueva interpretacion</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "symbolSequence": string,  // Se convierte a UPPERCASE automaticamente
  "userDefinition": string,
  "notes"?: string
}
// discoveryDate se genera automaticamente en el backend`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">PATCH</Badge>
                <CardTitle className="font-mono text-base">/api/lexicon/:id</CardTitle>
              </div>
              <CardDescription>Actualizar interpretacion existente</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">DELETE</Badge>
                <CardTitle className="font-mono text-base">/api/lexicon/:id</CardTitle>
              </div>
              <CardDescription>Eliminar interpretacion</CardDescription>
            </CardHeader>
          </Card>

          <Separator className="my-6" />

          {/* Notice Board Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Pin className="h-5 w-5 text-primary" />
            Notice Board
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/notices</CardTitle>
              </div>
              <CardDescription>Obtener todos los avisos del tablero</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{ "notices": Notice[] }`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/notices</CardTitle>
              </div>
              <CardDescription>Crear nuevo aviso</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "type": "mission" | "ad" | "news",
  "title": string,
  "content": string,
  "position": { "x": number, "y": number },
  "rotation": number
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">PATCH</Badge>
                <CardTitle className="font-mono text-base">/api/notices/:id</CardTitle>
              </div>
              <CardDescription>Actualizar aviso (incluido posicion al arrastrar)</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">DELETE</Badge>
                <CardTitle className="font-mono text-base">/api/notices/:id</CardTitle>
              </div>
              <CardDescription>Eliminar aviso</CardDescription>
            </CardHeader>
          </Card>

          <Separator className="my-6" />

          {/* Bestiary Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Skull className="h-5 w-5 text-primary" />
            Bestiary
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/bestiary</CardTitle>
              </div>
              <CardDescription>Obtener todas las criaturas</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{ "creatures": Creature[] }`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/bestiary</CardTitle>
              </div>
              <CardDescription>Agregar nueva criatura</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "name": string,
  "type": "Plant" | "Undead" | "Humanoid" | "Elemental" | "Construct" | "Beast" | "Fiend",
  "cr": string,
  "hp": string,
  "ac": string,
  "vulnerabilities": string,
  "description": string
}`}
              </pre>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Pantheon Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Pantheon
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/pantheon</CardTitle>
              </div>
              <CardDescription>Obtener todas las deidades</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "greaterDeities": Deity[],
  "lesserIdols": Deity[]
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/pantheon/:type</CardTitle>
              </div>
              <CardDescription>Agregar deidad (:type = "greater" | "lesser")</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "name": string,
  "domain": string,
  "description": string,
  "symbol": string
}`}
              </pre>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Chronicles Section */}
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Chronicles
          </h3>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">GET</Badge>
                <CardTitle className="font-mono text-base">/api/chronicles</CardTitle>
              </div>
              <CardDescription>Obtener todos los arcos de historia con sesiones</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{ "storyArcs": StoryArc[] }`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/chronicles</CardTitle>
              </div>
              <CardDescription>Crear nuevo arco de historia</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "title": string,
  "sessions": []  // Arco vacio, sesiones se agregan despues
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">POST</Badge>
                <CardTitle className="font-mono text-base">/api/chronicles/:arcId/sessions</CardTitle>
              </div>
              <CardDescription>Agregar sesion a un arco</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-secondary/50 p-3 rounded-lg">
{`{
  "title": string,    // ej: "Session 7: The Final Battle"
  "summary": string,  // Resumen de la sesion
  "secret": string    // Secreto oculto
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Mock Data Examples */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Datos de Ejemplo Completos (Mock Data)
          </h2>
          
          <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Todos los mock data estan definidos en <code className="bg-secondary px-1 rounded">/lib/campaign-data.ts</code>. 
              Puedes copiarlos directamente para tu base de datos.
            </span>
          </div>

          <Tabs defaultValue="characters" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="characters" className="font-mono text-xs">Characters</TabsTrigger>
              <TabsTrigger value="shared" className="font-mono text-xs">SharedInventory</TabsTrigger>
              <TabsTrigger value="lexicon" className="font-mono text-xs">Lexicon</TabsTrigger>
              <TabsTrigger value="notices" className="font-mono text-xs">Notices</TabsTrigger>
              <TabsTrigger value="bestiary" className="font-mono text-xs">Bestiary</TabsTrigger>
              <TabsTrigger value="pantheon" className="font-mono text-xs">Pantheon</TabsTrigger>
              <TabsTrigger value="chronicles" className="font-mono text-xs">Chronicles</TabsTrigger>
            </TabsList>

            <TabsContent value="characters" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">mockAdventurers</CardTitle>
                  <CardDescription>4 personajes de ejemplo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  {
    "id": "p-1",
    "ownerId": "u-1",
    "name": "Tharion Blackwood",
    "class": "Paladin",
    "level": 7,
    "hp": { "current": 58, "max": 72 },
    "stats": { "str": 18, "dex": 10, "con": 16, "int": 10, "wis": 14, "cha": 16 },
    "influence": 72,
    "gold": 450,
    "status": "Active",
    "personalItems": [
      { "id": "i-1", "name": "Holy Symbol of Aethon", "quantity": 1, "type": "misc" },
      { "id": "i-2", "name": "Lay on Hands (remaining)", "quantity": 35, "type": "misc" }
    ]
  },
  {
    "id": "p-2",
    "ownerId": "u-2",
    "name": "Lyra Whisperwind",
    "class": "Ranger",
    "level": 7,
    "hp": { "current": 52, "max": 52 },
    "stats": { "str": 12, "dex": 18, "con": 14, "int": 12, "wis": 16, "cha": 10 },
    "influence": 58,
    "gold": 280,
    "status": "Active",
    "personalItems": [
      { "id": "i-3", "name": "Quiver of Endless Arrows", "quantity": 1, "type": "weapon" },
      { "id": "i-4", "name": "Beast Companion: Shadow (Wolf)", "quantity": 1, "type": "misc" }
    ]
  },
  {
    "id": "p-3",
    "ownerId": "u-3",
    "name": "Zephyr Stormcaller",
    "class": "Sorcerer",
    "level": 6,
    "hp": { "current": 32, "max": 38 },
    "stats": { "str": 8, "dex": 14, "con": 12, "int": 14, "wis": 10, "cha": 20 },
    "influence": 85,
    "gold": -50,  // NOTA: Valor negativo = deuda
    "status": "Active",
    "personalItems": [
      { "id": "i-5", "name": "Staff of Thunder", "quantity": 1, "type": "weapon" },
      { "id": "i-6", "name": "Sorcery Points", "quantity": 6, "type": "misc" }
    ]
  },
  {
    "id": "p-4",
    "ownerId": "u-4",
    "name": "Grimjaw Ironfist",
    "class": "Fighter",
    "level": 7,
    "hp": { "current": 28, "max": 85 },
    "stats": { "str": 20, "dex": 12, "con": 18, "int": 8, "wis": 10, "cha": 10 },
    "influence": 45,
    "gold": 125,
    "status": "Wounded",
    "personalItems": [
      { "id": "i-7", "name": "Greataxe +1", "quantity": 1, "type": "weapon" },
      { "id": "i-8", "name": "Action Surge (remaining)", "quantity": 1, "type": "misc" }
    ]
  }
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shared" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">mockSharedInventory</CardTitle>
                  <CardDescription>Items compartidos del grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  { "id": "s-1", "name": "Gold Pieces", "quantity": 2340, "type": "Currency", "icon": "coins", "fixed": true },
  { "id": "s-2", "name": "Bag of Holding", "quantity": 1, "type": "Magic Item", "icon": "backpack" },
  { "id": "s-3", "name": "Health Potions", "quantity": 5, "type": "Consumable", "icon": "flask" },
  { "id": "s-4", "name": "Obsidian Key", "quantity": 1, "type": "Quest Item", "icon": "key" },
  { "id": "s-5", "name": "Enchanted Longsword", "quantity": 1, "type": "Magic Item", "icon": "sword" },
  { "id": "s-6", "name": "Scroll of Teleportation", "quantity": 2, "type": "Consumable", "icon": "scroll" },
  { "id": "s-7", "name": "Rations", "quantity": 18, "type": "Resource", "icon": "apple" },
  { "id": "s-8", "name": "Rope (50ft)", "quantity": 3, "type": "Resource", "icon": "link" },
  { "id": "s-9", "name": "Arcane Focus Crystal", "quantity": 1, "type": "Quest Item", "icon": "gem" }
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lexicon" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">mockLexicon</CardTitle>
                  <CardDescription>Interpretaciones de simbolos arcanos</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  {
    "id": "1",
    "symbolSequence": "KHM",
    "userDefinition": "Danger/Blood",
    "notes": "Found inscribed on the cultist altar in Thornmere",
    "discoveryDate": "2024-03-20"
  },
  {
    "id": "2",
    "symbolSequence": "VRX",
    "userDefinition": "World Tree",
    "notes": "Repeated in the elven ruins",
    "discoveryDate": "2024-03-22"
  },
  {
    "id": "3",
    "symbolSequence": "ZTHAAL",
    "userDefinition": "The Unnamed One",
    "notes": "Whisper's true name? Very dangerous.",
    "discoveryDate": "2024-03-25"
  }
]`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notices" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">mockNotices</CardTitle>
                  <CardDescription>Avisos del tablero de anuncios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  {
    "id": "1",
    "type": "mission",
    "title": "The Silent Woods",
    "content": "Reports of strange lights bearing the mark of KHM near the old druid grove...",
    "position": { "x": 40, "y": 30 },
    "rotation": -3
  },
  {
    "id": "2",
    "type": "ad",
    "title": "Barnaby's Potions",
    "content": "20% off on Greater Healing Potions this week only!...",
    "position": { "x": 280, "y": 60 },
    "rotation": 2
  },
  {
    "id": "3",
    "type": "news",
    "title": "Royal Decree",
    "content": "By order of King Aldric III: The eastern trade routes shall remain closed...",
    "position": { "x": 520, "y": 40 },
    "rotation": -1
  },
  {
    "id": "4",
    "type": "mission",
    "title": "Lost Heirloom",
    "content": "REWARD: 200 gold pieces for the return of the Ashford family signet ring...",
    "position": { "x": 140, "y": 220 },
    "rotation": 4
  },
  {
    "id": "5",
    "type": "news",
    "title": "Festival Announcement",
    "content": "The Festival of Three Moons approaches!...",
    "position": { "x": 400, "y": 200 },
    "rotation": -2
  },
  {
    "id": "6",
    "type": "ad",
    "title": "Sellswords Wanted",
    "content": "The Iron Fist Mercenary Company seeks skilled fighters...",
    "position": { "x": 60, "y": 380 },
    "rotation": 1
  }
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bestiary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">bestiary</CardTitle>
                  <CardDescription>Criaturas del bestiario (8 criaturas)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  {
    "id": "b1",
    "name": "Thornblight Shambler",
    "type": "Plant",
    "cr": "3",
    "hp": "68",
    "ac": "13",
    "vulnerabilities": "Fire, Slashing",
    "description": "A corrupted plant creature found in Thornmere..."
  },
  {
    "id": "b2",
    "name": "Obsidian Wraith",
    "type": "Undead",
    "cr": "5",
    "hp": "85",
    "ac": "15",
    "vulnerabilities": "Radiant, Force",
    "description": "A spectral being bound to obsidian shards..."
  },
  {
    "id": "b3",
    "name": "Verdant Spiral Cultist",
    "type": "Humanoid",
    "cr": "2",
    "hp": "45",
    "ac": "12",
    "vulnerabilities": "None",
    "description": "Fanatical followers of the Verdant Spiral cult..."
  },
  {
    "id": "b4",
    "name": "Rift Elemental",
    "type": "Elemental",
    "cr": "7",
    "hp": "126",
    "ac": "16",
    "vulnerabilities": "Force",
    "description": "A chaotic entity born from tears in the planar fabric..."
  },
  // ... mas criaturas en /lib/campaign-data.ts
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pantheon" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">greaterDeities & lesserIdols</CardTitle>
                  <CardDescription>Deidades del panteon</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`// Greater Deities (3)
[
  {
    "name": "Aethon, The Radiant Warden",
    "domain": "Light, Justice, Protection",
    "description": "The supreme deity of order and justice...",
    "symbol": "A golden sun behind a raised shield"
  },
  {
    "name": "Nyxara, The Void Mother",
    "domain": "Darkness, Secrets, Death",
    "description": "The keeper of all that is hidden...",
    "symbol": "A crescent moon wreathed in shadow"
  },
  {
    "name": "Thaloros, The World Shaper",
    "domain": "Earth, Creation, Nature",
    "description": "The ancient god who shaped the continents...",
    "symbol": "A mountain peak with roots growing from its base"
  }
]

// Lesser Idols (4)
[
  {
    "name": "Veska, The Trickster",
    "domain": "Luck, Mischief, Trade",
    "description": "A chaotic spirit worshipped by merchants and thieves...",
    "symbol": "Two coins spinning in opposite directions"
  },
  {
    "name": "Korrath, The Iron Judge",
    "domain": "War, Honor, Smithing",
    "description": "The patron of warriors who fight with honor...",
    "symbol": "An anvil bisected by a sword"
  },
  // ... mas en /lib/campaign-data.ts
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chronicles" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono text-base">storyArcs</CardTitle>
                  <CardDescription>Arcos de historia con sesiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`[
  {
    "id": "arc-1",
    "title": "The Shattered Vigil",
    "sessions": [
      {
        "id": "s1",
        "title": "Session 1: Whispers in Greyhaven",
        "summary": "The party met at the Broken Chalice tavern in Greyhaven after each receiving a cryptic summons...",
        "secret": "Verath is actually an agent of the Obsidian Crown. His true name is Maltheus..."
      },
      {
        "id": "s2",
        "title": "Session 2: The Thornmere Descent",
        "summary": "Venturing into Thornmere, the party discovered an ancient elven ruin...",
        "secret": "The chanting is from the Cult of the Verdant Spiral..."
      },
      {
        "id": "s3",
        "title": "Session 3: Roots of the Old Gods",
        "summary": "Deep beneath Thornmere, the party uncovered a vast underground chamber...",
        "secret": "The obsidian key opens a vault beneath the Temple of Aethon..."
      }
    ]
  },
  {
    "id": "arc-2",
    "title": "The Obsidian Crown",
    "sessions": [
      {
        "id": "s4",
        "title": "Session 4: The Capital Burns",
        "summary": "Arriving at the capital city of Valdris, the party found it under martial law...",
        "secret": "The king is not dead. He has been placed in a magical stasis..."
      },
      // ... mas sesiones
    ]
  },
  {
    "id": "arc-3",
    "title": "The Convergence",
    "sessions": [ /* ... */ ]
  }
]`}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <div className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Codex Arcanum API Documentation v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
