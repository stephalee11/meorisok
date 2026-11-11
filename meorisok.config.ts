export const sources = [
  {
    id: "wander",
    label: "Wander",
    dataSourceId: "41405125-09c4-80c1-acc9-000b03e4f2ee",
    color: "berry", // token name from the design system
    props: { title: "Name", status: "Status", due: "Due Date" },
  },
  {
    id: "plumbob",
    label: "Plumbob protector",
    dataSourceId: "40605125-09c4-809c-adb2-000b286d021f",
    color: "matcha",
    props: {
      title: "Name",
      status: "Status",
      due: "Due Date",
      priority: "Priority",
      phase: "Phase",
    },
  },
] as const;

export type Source = (typeof sources)[number];
