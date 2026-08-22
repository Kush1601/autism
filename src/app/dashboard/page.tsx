import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Plus, Users, ClipboardList, ChevronRight, Activity, Gamepad2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [children, totalScreenings, activeTherapyPlans, highRiskCount] = await Promise.all([
    prisma.child.findMany({
      where: { userId: session.user.id },
      include: { screenings: { orderBy: { completedAt: "desc" }, take: 1 } },
    }),
    prisma.screening.count({ where: { child: { userId: session.user.id } } }),
    prisma.therapyPlan.count({ where: { child: { userId: session.user.id }, status: "Active" } }),
    prisma.screening.count({
      where: { child: { userId: session.user.id }, riskLevel: "High" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Aggregate stats */}
      {children.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-pine-50/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{children.length}</p>
                <p className="text-xs text-neutral-500 font-medium">Children</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-secondary/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{totalScreenings}</p>
                <p className="text-xs text-neutral-500 font-medium">Screenings Done</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Gamepad2 className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{activeTherapyPlans}</p>
                <p className="text-xs text-neutral-500 font-medium">Active Therapies</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`border-none shadow-sm ${highRiskCount > 0 ? "bg-red-50/60" : "bg-neutral-50"}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${highRiskCount > 0 ? "bg-red-100" : "bg-neutral-100"}`}>
                <AlertTriangle className={`h-5 w-5 ${highRiskCount > 0 ? "text-red-500" : "text-neutral-400"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{highRiskCount}</p>
                <p className="text-xs text-neutral-500 font-medium">High Risk Screens</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Parent Dashboard</h1>
          <p className="text-neutral-500">Monitor your children&apos;s development and screening results.</p>
        </div>
        <Link href="/dashboard/child/new">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add Child Profile
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardHeader className="pt-0">
            <CardTitle>No Child Profiles Found</CardTitle>
            <CardDescription className="max-w-xs">
              Start by creating a profile for your child to begin the screening process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/child/new">
              <Button variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Register First Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-neutral-50/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {child.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription>{child.age} years old • {child.gender}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Latest Screening:</span>
                    <span className={child.screenings[0] ? "font-medium text-neutral-900" : "text-neutral-400 italic"}>
                      {child.screenings[0] 
                        ? new Date(child.screenings[0].completedAt).toLocaleDateString() 
                        : "Never"}
                    </span>
                  </div>
                  
                  {child.screenings[0] && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Risk Level:</span>
                      <span className={`px-2 py-0.5 rounded-full text-white text-xs font-bold ${
                        child.screenings[0].riskLevel === "High" ? "bg-red-500" :
                        child.screenings[0].riskLevel === "Medium" ? "bg-orange-500" : "bg-pine-500"
                      }`}>
                        {child.screenings[0].riskLevel}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <Link href={`/screening/${child.id}`} className="w-full">
                      <Button variant={child.screenings[0] ? "outline" : "default"} className="w-full justify-between">
                        {child.screenings[0] ? "Retake Screening" : "Start Screening"}
                        <ClipboardList className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/child/${child.id}`} className="w-full">
                      <Button variant="ghost" className="w-full justify-between text-primary hover:text-primary-dark hover:bg-primary/5">
                        View Detailed Reports
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Quick Card */}
          <Link href="/dashboard/child/new" className="h-full">
            <div className="border-2 border-dashed border-neutral-200 rounded-lg h-full flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-neutral-50 transition-all cursor-pointer group">
              <PlusCircle className="h-10 w-10 text-neutral-300 group-hover:text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-500 group-hover:text-primary">Add Another Child</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
