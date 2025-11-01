import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Cursos Variados',
      description: 'Acesse uma ampla variedade de cursos ministrados por instrutores qualificados',
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros alunos e compartilhe conhecimento',
    },
    {
      icon: Award,
      title: 'Certificados',
      description: 'Receba certificados ao concluir os cursos',
    },
    {
      icon: TrendingUp,
      title: 'Acompanhe seu Progresso',
      description: 'Monitore seu desenvolvimento ao longo do tempo',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground shadow-lg md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Bem-vindo ao Portal de Cursos
          </h1>
          <p className="mb-8 text-lg opacity-90 md:text-xl">
            Aprenda novas habilidades, expanda seus conhecimentos e alcance seus objetivos
            profissionais com nossos cursos especializados.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/courses')}
            className="text-lg"
          >
            Explorar Cursos
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Por que escolher nossos cursos?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Comece sua jornada de aprendizado hoje</h2>
          <p className="mb-6 text-muted-foreground">
            Matricule-se em cursos de alta qualidade e desenvolva as habilidades necessárias para
            o sucesso.
          </p>
          <Button onClick={() => navigate('/courses')} size="lg">
            Ver Todos os Cursos
          </Button>
        </div>
      </section>
    </div>
  );
}
