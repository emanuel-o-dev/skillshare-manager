import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

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

  const benefits = [
    'Acesso ilimitado a todos os cursos',
    'Aprenda no seu próprio ritmo',
    'Certificados reconhecidos',
    'Suporte de instrutores especializados',
    'Conteúdo atualizado regularmente',
    'Comunidade de aprendizado colaborativa',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Portal de Cursos API</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Plataforma de Aprendizado Completa</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Transforme seu Futuro com{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Educação de Qualidade
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Aprenda novas habilidades, expanda seus conhecimentos e alcance seus objetivos
            profissionais com nossos cursos especializados ministrados por especialistas da
            indústria.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/auth')}>
              Comece Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate('/auth')}
            >
              Ver Cursos Disponíveis
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Por que escolher nossos cursos?</h2>
          <p className="text-lg text-muted-foreground">
            Recursos projetados para maximizar seu aprendizado
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 transition-all hover:border-primary hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Tudo que você precisa para ter sucesso
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Nossa plataforma oferece uma experiência completa de aprendizado, com recursos que
              ajudam você a alcançar seus objetivos profissionais.
            </p>
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle>Mais de 1000+ alunos</CardTitle>
                <CardDescription>
                  Junte-se a milhares de profissionais que transformaram suas carreiras
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader>
                <CardTitle>Certificação Reconhecida</CardTitle>
                <CardDescription>
                  Certificados validados por empresas líderes do mercado
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 bg-gradient-to-br from-primary to-accent p-1">
          <div className="rounded-lg bg-card p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Pronto para começar sua jornada?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Cadastre-se agora e tenha acesso imediato a todos os nossos cursos
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Portal de Cursos API. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
