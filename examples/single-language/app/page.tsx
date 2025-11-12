import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header with theme toggle */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            next-md-blog Example
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A Next.js example application demonstrating the next-md-blog library
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/blogs">View All Posts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog/welcome">Example Post</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Everything you need to build a beautiful blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Markdown support with frontmatter</li>
                <li>Dynamic blog routes</li>
                <li>Type-safe API</li>
                <li>Easy to integrate</li>
                <li>SEO optimized</li>
                <li>Dark mode support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Get up and running in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>
                  Install:{' '}
                  <code className="bg-muted px-2 py-1 rounded text-sm">npm install @florianamette/next-md-blog</code>
                </li>
                <li>
                  Initialize:{' '}
                  <code className="bg-muted px-2 py-1 rounded text-sm">npx @florianamette/next-md-blog-init</code>
                </li>
                <li>
                  Add posts to the <code className="bg-muted px-2 py-1 rounded text-sm">posts/</code> folder
                </li>
                <li>Visit <code className="bg-muted px-2 py-1 rounded text-sm">/blog/[slug]</code></li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
