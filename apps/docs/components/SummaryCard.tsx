import { Card, CardContent } from "@repo/ui/card";
import { Users, MessageSquare, FileText } from "lucide-react";

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-slate-950 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">225</div>
              <div className="text-sm text-slate-400">Patient</div>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-950 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">195</div>
              <div className="text-sm text-slate-400">Consultation</div>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-950 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">180</div>
              <div className="text-sm text-slate-400">Report</div>
              <div className="text-xs text-slate-500">Last 30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
