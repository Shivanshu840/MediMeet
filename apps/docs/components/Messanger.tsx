import { Card, CardContent } from "@repo/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { ChevronRightIcon } from 'lucide-react'
import Link from "next/link"

export function Messenger() {
  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Messenger</h3>
          <Tabs defaultValue="patient" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full grid-cols-3 bg-slate-900">
                <TabsTrigger 
                  value="patient" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300"
                >
                  Patient
                </TabsTrigger>
                <TabsTrigger 
                  value="provider" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300"
                >
                  Provider
                </TabsTrigger>
                <TabsTrigger 
                  value="channels" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300"
                >
                  Channels
                </TabsTrigger>
              </TabsList>
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 ml-4">
                Go to messenger
              </Link>
            </div>
            <TabsContent value="patient" className="mt-4">
              <div className="space-y-4">
                {[
                  {
                    name: "Marvin McKinney",
                    date: "31/07/21",
                    message: "Amet minim mollit non deserunt ullamco est ...",
                    avatar: "/placeholder.svg"
                  },
                  {
                    name: "Cameron Williamson",
                    date: "31/07/21",
                    message: "Malesuada Fermentum Tortor...",
                    avatar: "/placeholder.svg"
                  },
                  {
                    name: "Leslie Alexander",
                    date: "31/07/21",
                    message: "Parturient Venenatis Etiam...",
                    avatar: "/placeholder.svg"
                  }
                ].map((chat) => (
                  <div key={chat.name} className="flex items-center gap-4 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{chat.name}</div>
                        <div className="text-sm text-slate-400">{chat.date}</div>
                      </div>
                      <div className="text-sm text-slate-400 truncate">{chat.message}</div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="provider" className="mt-4">
              <div className="text-center text-slate-400">No provider messages.</div>
            </TabsContent>
            <TabsContent value="channels" className="mt-4">
              <div className="text-center text-slate-400">No active channels.</div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}