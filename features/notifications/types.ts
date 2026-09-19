export type NotificationItem = {
  id: string;
  text: string;
  href: string;
  at: string;
};

export type NotificationSignal = {
  hasNew: boolean;
  items: NotificationItem[];
};
