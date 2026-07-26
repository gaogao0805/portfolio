"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { AGENTS } from "./agentsData";

/**
 * 转盘复刻与对话复刻共享的经纪人选择。
 * 在转盘里选了谁，对话模块就用谁的头像和名字。
 */

const AgentSelectionContext = createContext<{
  agentKey: string;
  setAgentKey: (key: string) => void;
}>({
  agentKey: AGENTS[0].key,
  setAgentKey: () => {},
});

export function AgentSelectionProvider({ children }: { children: ReactNode }) {
  const [agentKey, setAgentKey] = useState(AGENTS[0].key);

  return (
    <AgentSelectionContext.Provider value={{ agentKey, setAgentKey }}>
      {children}
    </AgentSelectionContext.Provider>
  );
}

export function useAgentSelection() {
  return useContext(AgentSelectionContext);
}
