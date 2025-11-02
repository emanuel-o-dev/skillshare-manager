import { useState, useEffect } from 'react';
import { Course, CreateCourseDto } from '@/types/api';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CourseDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function CourseDialog({ course, open, onOpenChange, onSave }: CourseDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCourseDto>({
    code: '',
    name: '',
    description: '',
    hoursTotal: 0,
    level: 'Básico',
    type: 'Presencial',
    prerequisites: [],
  });
  const [prerequisitesText, setPrerequisitesText] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code,
        name: course.name,
        description: course.description,
        hoursTotal: course.hoursTotal,
        level: course.level,
        type: course.type,
        prerequisites: course.prerequisites,
      });
      setPrerequisitesText(course.prerequisites.join(', '));
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        hoursTotal: 0,
        level: 'Básico',
        type: 'Presencial',
        prerequisites: [],
      });
      setPrerequisitesText('');
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        prerequisites: prerequisitesText
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0),
      };

      if (course) {
        await api.updateCourse(course.id, dataToSend);
        toast({
          title: 'Curso atualizado',
          description: 'O curso foi atualizado com sucesso.',
        });
      } else {
        await api.createCourse(dataToSend);
        toast({
          title: 'Curso criado',
          description: 'O curso foi criado com sucesso.',
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Erro ao salvar curso',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
          <DialogDescription>
            {course ? 'Atualize as informações do curso.' : 'Preencha os dados do novo curso.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="CURSO1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursTotal">Horas Totais *</Label>
              <Input
                id="hoursTotal"
                type="number"
                min="1"
                value={formData.hoursTotal}
                onChange={(e) => setFormData({ ...formData, hoursTotal: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Nome do curso"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Descrição do curso"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Nível *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="EAD">EAD</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Pré-requisitos</Label>
            <Input
              id="prerequisites"
              value={prerequisitesText}
              onChange={(e) => setPrerequisitesText(e.target.value)}
              placeholder="Separe por vírgula: Matemática Básica, Lógica"
            />
            <p className="text-xs text-muted-foreground">
              Separe múltiplos pré-requisitos por vírgula
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
