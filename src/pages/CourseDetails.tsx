import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Course } from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, BookOpen, Calendar } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCourse(Number(id));
      console.log("Curso carregado:", data);
      console.log("Enrollments:", data.Enrollment);
      setCourse(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar curso",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      navigate("/courses");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("User do contexto:", user);
  // Normalize user id because backend may return different shapes (wrapped object, different key names)
  const getUserId = (u: any) => {
    if (!u) return undefined;
    // common variants
    if (typeof u.id !== "undefined") return u.id;
    if (typeof u.ID !== "undefined") return u.ID;
    if (typeof u.userId !== "undefined") return u.userId;
    if (u.user && typeof u.user.id !== "undefined") return u.user.id;
    if (u.data && typeof u.data.id !== "undefined") return u.data.id;
    return undefined;
  };

  const currentUserId = getUserId(user);

  console.log("User ID:", currentUserId);

  const isEnrolled =
    course?.Enrollment?.some((enrollment) => {
      const enrollmentUserId =
        getUserId(enrollment.user) ?? enrollment.user?.id;
      console.log(
        "Comparando enrollment.user.id:",
        enrollmentUserId,
        "com currentUserId:",
        currentUserId
      );
      return Number(enrollmentUserId) === Number(currentUserId);
    }) || false;

  console.log("isEnrolled:", isEnrolled);

  const handleEnroll = async () => {
    if (!course) return;

    setIsEnrolling(true);
    try {
      await api.enrollCourse(course.id);
      toast({
        title: "Matrícula realizada",
        description: "Você foi matriculado no curso com sucesso.",
      });
      loadCourse();
    } catch (error) {
      toast({
        title: "Erro ao matricular",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!course) return;

    setIsEnrolling(true);
    try {
      await api.unenrollCourse(course.id);
      toast({
        title: "Matrícula cancelada",
        description: "Sua matrícula foi cancelada com sucesso.",
      });
      loadCourse();
    } catch (error) {
      toast({
        title: "Erro ao cancelar matrícula",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/courses")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Cursos
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl">{course.name}</CardTitle>
                  <Badge variant="outline">{course.code}</Badge>
                </div>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duração</p>
                  <p className="text-sm text-muted-foreground">
                    {course.hoursTotal}h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nível</p>
                  <p className="text-sm text-muted-foreground">
                    {course.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tipo</p>
                  <p className="text-sm text-muted-foreground">{course.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Inscritos</p>
                  <p className="text-sm text-muted-foreground">
                    {course.Enrollment?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Criado por</h3>
              <p className="text-sm text-muted-foreground">
                {course.createdBy.name} ({course.createdBy.email})
              </p>
            </div>

            {course.prerequisites && course.prerequisites.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Pré-requisitos</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex gap-3">
              {!isAdmin && (
                <Button
                  onClick={isEnrolled ? handleUnenroll : handleEnroll}
                  disabled={isEnrolling}
                  variant={isEnrolled ? "secondary" : "default"}
                  size="lg"
                >
                  {isEnrolling
                    ? "Processando..."
                    : isEnrolled
                    ? "Cancelar Matrícula"
                    : "Matricular-se"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {course.Enrollment && course.Enrollment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Alunos Inscritos ({course.Enrollment.length})
              </CardTitle>
              <CardDescription>
                Lista de alunos matriculados neste curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.Enrollment.map((enrollment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">{enrollment.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.user.email}
                      </p>
                    </div>
                    {enrollment.user.id === user?.id && (
                      <Badge variant="outline">Você</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
