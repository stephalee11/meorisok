/** You. The Board only shows tickets assigned to this Notion user. */
export const me = {
  notionUserId: "8434b1ed-eb98-4daa-bd3b-f6a8adefd57b",
};

export const sources = [
  {
    id: "wander",
    label: "Wander",
    dataSourceId: "41405125-09c4-80c1-acc9-000b03e4f2ee",
    color: "berry", // token name from the design system
    props: { title: "Name", status: "Status", due: "Due Date", assignee: "Assignee" },
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
      assignee: "Person",
      priority: "Priority",
      phase: "Phase",
    },
  },
] as const;

export type Source = (typeof sources)[number];
