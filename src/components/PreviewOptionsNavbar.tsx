import { Box, Container, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import { Link as LinkRouter } from "react-router-dom";
import { GiSunglasses } from "react-icons/gi";
import { BrandName } from "@src/constants";

export default function PreviewOptionsNavbar() {
    return (
        <Box
            as="nav"
            bg="black"
            color={useColorModeValue("gray.600", "white")}
            py="2"
            w="100%"
            position="relative"
            zIndex={999}
        >
            <Container maxW="7xl">
                <Flex align="center" justify="space-between">
                    {/* Brand Name on the left */}
                    <Link
                        as={LinkRouter}
                        to="/"
                        fontSize="xl"
                        fontWeight="medium"
                        color="white"
                    >
                        {BrandName}
                    </Link>

                    {/* Icon in the center */}
                    <Flex justify="center" flex="1">
                        <GiSunglasses size={60} color="white" />
                    </Flex>

                    {/* Arabic text and ThemeToggle on the right */}
                    <Flex align="center" justify="flex-end" gap={4}>
                        <Link
                            as={LinkRouter}
                            to="/"
                            fontSize="2xl"
                            fontWeight="medium"
                            color="white"
                            fontFamily="arabic"
                        >
                            عالم النظارات
                        </Link>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
}
