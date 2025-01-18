import { Box, Flex, Icon, Text, useColorModeValue, VStack, Stat, StatNumber, StatHelpText } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface CardProps {
  icon: IconType;
  entity: string;
  value: number;
  currency: string;
  trend?: string;
  variant?: 'blue' | 'green' | 'red';
}

export default function EnhancedCard({ icon, entity, value, currency, trend, variant = 'green' }: CardProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const variantColors = {
    blue: {
      light: "blue.100",
      dark: "blue.700",
      icon: "blue.500",
    },
    green: {
      light: "green.100",
      dark: "green.700",
      icon: "green.500",
    },
    red: {
      light: "red.100",
      dark: "red.700",
      icon: "red.500",
    },
  };

  const safeVariant = variant in variantColors ? variant : 'blue';
  const iconBgColor = useColorModeValue(variantColors[safeVariant].light, variantColors[safeVariant].dark);
  const iconColor = variantColors[safeVariant].icon;

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="md"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "lg",
      }}
    >
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            {entity}
          </Text>
          <Stat>
            <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>
              {value?.toLocaleString()}
              <Text as="span" fontSize="lg" fontWeight="medium" ml={1}>
                {currency}
              </Text>
            </StatNumber>
            {trend && (
              <StatHelpText 
                fontSize="xs" 
                color={trend.startsWith('+') ? "green.500" : "red.500"}
              >
                {trend}
              </StatHelpText>
            )}
          </Stat>
        </VStack>
        <Box
          bg={iconBgColor}
          p={3}
          borderRadius="full"
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.1)",
          }}
        >
          <Icon as={icon} fontSize="2xl" color={iconColor} />
        </Box>
      </Flex>
    </Box>
  );
}
