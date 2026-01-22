import { ForexView } from "@/components/views/Forex";
import { OverviewView } from "@/components/views/Overview";
import { LayoutDashboard, Globe, IndianRupee } from "lucide-react";
import { IndianView } from "../components/views/Indian";
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
];
