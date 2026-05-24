import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Href, usePathname } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import {
    BarbellIcon,
    ClockCounterClockwiseIcon,
    HouseIcon,
    Icon as PhosphorIcon,
} from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    LayoutChangeEvent,
    Pressable,
    PressableProps,
    View,
} from "react-native";

const TAB_LIST_PADDING = 4;
const PILL_ALIGNMENT_OFFSET = -1;

type TabLayout = {
  x: number;
  width: number;
};

const TAB_ROUTES: {
  name: string;
  href: Href;
  icon: PhosphorIcon;
  label: string;
}[] = [
  {
    name: "index",
    href: "/",
    icon: HouseIcon,
    label: "Inicio",
  },
  {
    name: "history",
    href: "/history",
    icon: ClockCounterClockwiseIcon,
    label: "Historial",
  },
  {
    name: "exercises",
    href: "/exercises",
    icon: BarbellIcon,
    label: "Ejercicios",
  },
];

export default function Layout() {
  const pathname = usePathname();
  const [tabLayouts, setTabLayouts] = useState<Record<string, TabLayout>>({});
  const [lastMatchedTabName, setLastMatchedTabName] = useState(
    TAB_ROUTES[0].name,
  );
  const pillTranslateX = useRef(new Animated.Value(0)).current;
  const pillAnimatedWidth = useRef(new Animated.Value(0)).current;
  const hasMeasuredPill = useRef(false);
  const matchedRoute = getMatchedTabRoute(pathname);
  const activeRoute =
    matchedRoute ??
    TAB_ROUTES.find((route) => route.name === lastMatchedTabName) ??
    TAB_ROUTES[0];
  const activeTabLayout = activeRoute
    ? tabLayouts[activeRoute.name]
    : undefined;

  useEffect(() => {
    if (!matchedRoute) return;

    setLastMatchedTabName((currentName) =>
      currentName === matchedRoute.name ? currentName : matchedRoute.name,
    );
  }, [matchedRoute]);

  useEffect(() => {
    if (!activeTabLayout) return;

    const nextTranslateX = activeTabLayout.x + PILL_ALIGNMENT_OFFSET;

    if (!hasMeasuredPill.current) {
      pillTranslateX.setValue(nextTranslateX);
      pillAnimatedWidth.setValue(activeTabLayout.width);
      hasMeasuredPill.current = true;
      return;
    }

    Animated.parallel([
      Animated.spring(pillTranslateX, {
        toValue: nextTranslateX,
        bounciness: 6,
        speed: 14,
        useNativeDriver: false,
      }),
      Animated.spring(pillAnimatedWidth, {
        toValue: activeTabLayout.width,
        bounciness: 6,
        speed: 14,
        useNativeDriver: false,
      }),
    ]).start();
  }, [activeTabLayout, pillAnimatedWidth, pillTranslateX]);

  function handleTabItemLayout(name: string, event: LayoutChangeEvent) {
    const { width, x } = event.nativeEvent.layout;

    setTabLayouts((currentLayouts) => {
      const currentLayout = currentLayouts[name];

      if (currentLayout?.x === x && currentLayout.width === width) {
        return currentLayouts;
      }

      return {
        ...currentLayouts,
        [name]: { width, x },
      };
    });
  }

  return (
    <Tabs>
      <TabSlot />

      <TabList asChild>
        <View className="bg-surface mx-4 mb-3 mt-4 p-1 border border-border rounded-full overflow-hidden">
          {activeTabLayout ? (
            <Animated.View
              pointerEvents="none"
              className="bg-accent-soft absolute rounded-full left-0"
              style={[
                {
                  top: TAB_LIST_PADDING,
                  bottom: TAB_LIST_PADDING,
                  transform: [{ translateX: pillTranslateX }],
                  width: pillAnimatedWidth,
                },
              ]}
            />
          ) : null}
          {TAB_ROUTES.map((route) => (
            <TabTrigger
              key={route.name}
              name={route.name}
              href={route.href}
              asChild
            >
              <TabItem
                icon={route.icon}
                label={route.label}
                onLayout={(event) => handleTabItemLayout(route.name, event)}
              />
            </TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}

type TabItemProps = PressableProps & {
  isFocused?: boolean;
  icon: PhosphorIcon;
  label: string;
};

function TabItem({ isFocused, icon, label, ...props }: TabItemProps) {
  return (
    <Pressable
      {...props}
      className="rounded-full px-2.5 py-2 items-center justify-center flex-1 z-10"
    >
      <View className={cn("gap-0.5 items-center justify-center flex-1")}>
        <Icon
          as={icon}
          className={cn("text-muted", {
            "text-accent": isFocused,
          })}
          size={16}
        />
        <Text
          className={cn("text-xs text-muted", {
            "text-accent": isFocused,
          })}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function getMatchedTabRoute(pathname: string) {
  return TAB_ROUTES.find((route) => isTabRouteActive(pathname, route.href));
}

function isTabRouteActive(pathname: string, href: Href) {
  if (typeof href !== "string") return false;
  if (href === "/") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}
