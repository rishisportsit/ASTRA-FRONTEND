import { ForexView } from "@/components/views/Forex";
import { OverviewView } from "@/components/views/Overview";
import { LayoutDashboard, Globe, IndianRupee, Notebook, CheckSquare, MessageCircle } from "lucide-react";
import { IndianView } from "../components/views/Indian";
import { NotesView } from "@/components/views/NotesView";
import { TasksView } from "@/components/views/TasksView";
import { ChatView } from "@/components/views/ChatView";
import React from "react";

export interface TabConfig {
  id: string;
  label: string;
  icon: any;
  component: React.ReactNode;
}

export const tabsConfig: TabConfig[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    component: <OverviewView />,
  },
  {
    id: "forex",
    label: "Forex",
    icon: Globe,
    component: <ForexView />,
  },
  {
    id: "indian",
    label: "Indian",
    icon: IndianRupee,
    component: <IndianView />,
  },
  {
    id: "notes",
    label: "Notes",
    icon: Notebook,
    component: <NotesView />,
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    component: <TasksView />,
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    component: <ChatView />,
  },
];
