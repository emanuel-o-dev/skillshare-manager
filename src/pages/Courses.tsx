import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types/api';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import { CourseDialog } from '@/components/CourseDialog';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar cursos',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este curso?')) return;
    
    try {
      await api.deleteCourse(id);
      toast({
        title: 'Curso excluído',
        description: 'O curso foi removido com sucesso.',
      });
      loadCourses();
    } catch (error) {
      toast({
        title: 'Erro ao excluir curso',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCourse = async () => {
    await loadCourses();
    setIsDialogOpen(false);
    setSelectedCourse(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cursos Disponíveis</h1>
          <p className="text-muted-foreground">Explore e se matricule nos cursos</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setSelectedCourse(null);
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Curso
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{course.name}</CardTitle>
                <span className="text-xs font-medium text-muted-foreground">{course.code}</span>
              </div>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{course.hoursTotal}h de duração</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">Nível:</span>
                <span className="text-muted-foreground">{course.level}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">Tipo:</span>
                <span className="text-muted-foreground">{course.type}</span>
              </div>
              <p className="text-sm">
                <span className="font-medium">Criado por:</span> {course.createdBy.name}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={() => navigate(`/courses/${course.id}`)}
                variant="default"
                className="flex-1 gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
              {isAdmin && (
                <>
                  <Button
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsDialogOpen(true);
                    }}
                    variant="secondary"
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(course.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Nenhum curso disponível no momento.</p>
        </div>
      )}

      <CourseDialog
        course={selectedCourse}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCourse}
      />
    </div>
  );
}
