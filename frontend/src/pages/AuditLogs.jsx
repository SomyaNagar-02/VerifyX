import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Badge,
  Spinner,
  Table,
  Button,
  Icon,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Search,
  ShieldCheck,
  Upload,
  FileSearch,
} from "lucide-react";

// ─── Action Icon Map ─────────────────────────────────────────────────────────
const ACTION_META = {
  ISSUE:  { icon: Upload,      color: "blue.300",  bg: "blue.950",  border: "blue.800"  },
  VERIFY: { icon: ShieldCheck, color: "green.400", bg: "green.950", border: "green.800" },
  SEARCH: { icon: FileSearch,  color: "purple.300",bg: "purple.950",border: "purple.800"},
};

// ─── Result Badge ─────────────────────────────────────────────────────────────
const ResultBadge = ({ result }) => {
  const map = {
    GREEN:   { bg: "rgba(74,222,128,0.12)", color: "green.300",  border: "green.700"  },
    SUCCESS: { bg: "rgba(74,222,128,0.12)", color: "green.300",  border: "green.700"  },
    YELLOW:  { bg: "rgba(251,191,36,0.12)", color: "yellow.300", border: "yellow.700" },
    RED:     { bg: "rgba(248,113,113,0.12)",color: "red.300",    border: "red.700"    },
    FAILED:  { bg: "rgba(248,113,113,0.12)",color: "red.300",    border: "red.700"    },
  };
  const style = map[result] || { bg: "whiteAlpha.100", color: "whiteAlpha.600", border: "whiteAlpha.300" };
  return (
    <Badge
      px={3}
      py={1}
      borderRadius="full"
      bg={style.bg}
      color={style.color}
      border="1px solid"
      borderColor={style.border}
      fontSize="xs"
      fontWeight="bold"
    >
      {result}
    </Badge>
  );
};

// ─── Audit Logs Page ──────────────────────────────────────────────────────────
const AuditLogs = () => {
  const navigate = useNavigate();

  const [logs, setLogs]         = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const LIMIT = 20;

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (currentPage) => {
    setIsLoading(true);
    try {
      const res = await API.get(`/admin/logs?limit=${LIMIT}&page=${currentPage}`);
      if (res.data?.success) {
        setLogs(res.data.data || []);
        setPagination(res.data.pagination || { total: 0, pages: 1 });
      }
    } catch (error) {
      console.error("Audit log fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="black" color="white" py={10}>
      <Container maxW="container.xl">

        {/* Back Button */}
        <Button
          mb={6}
          variant="ghost"
          color="whiteAlpha.700"
          _hover={{ bg: "whiteAlpha.100", color: "white" }}
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft size={16} />
          <Text ml={1}>Back to Dashboard</Text>
        </Button>

        {/* Page Header */}
        <Flex align="center" gap={4} mb={8}>
          <Box
            p={3}
            borderRadius="xl"
            bg="green.950"
            border="1px solid"
            borderColor="green.800"
          >
            <Activity size={24} color="#4ade80" />
          </Box>

          <Box>
            <Heading size="lg">Audit Logs</Heading>
            <Text color="whiteAlpha.600" mt={1}>
              A complete timestamped record of all system actions tied to your account.
            </Text>
          </Box>

          {/* Total count badge */}
          {!isLoading && (
            <Badge
              ml="auto"
              px={3}
              py={1}
              borderRadius="full"
              bg="rgba(74,222,128,0.08)"
              color="green.300"
              border="1px solid"
              borderColor="green.800"
              fontSize="sm"
            >
              {pagination.total} total
            </Badge>
          )}
        </Flex>

        {/* Main Card */}
        <Box
          bg="rgba(255,255,255,0.03)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
        >
          {/* Loading */}
          {isLoading ? (
            <Flex justify="center" align="center" py={20}>
              <Spinner size="xl" color="green.400" />
            </Flex>

          ) : logs.length === 0 ? (

            /* Empty State */
            <Flex direction="column" align="center" justify="center" py={20} gap={4}>
              <Search size={48} color="rgba(255,255,255,0.2)" />
              <Text color="whiteAlpha.500">No audit log entries found.</Text>
            </Flex>

          ) : (

            /* Table */
            <Box overflowX="auto">
              <Table.Root variant="unstyled">

                {/* Table Header */}
                <Table.Header bg="rgba(255,255,255,0.03)">
                  <Table.Row>
                    <Table.ColumnHeader color="whiteAlpha.500" py={5}>
                      ACTION
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="whiteAlpha.500">
                      SEAL ID
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="whiteAlpha.500">
                      USER
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="whiteAlpha.500">
                      RESULT
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="whiteAlpha.500">
                      IP ADDRESS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="whiteAlpha.500" textAlign="right">
                      TIMESTAMP
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                {/* Table Body */}
                <Table.Body>
                  {logs.map((log, index) => {
                    const meta = ACTION_META[log.action] || ACTION_META.SEARCH;
                    const ActionIcon = meta.icon;
                    return (
                      <Table.Row
                        key={log._id || index}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.100"
                        transition="0.2s"
                        _hover={{ bg: "rgba(74,222,128,0.05)" }}
                      >

                        {/* Action */}
                        <Table.Cell py={5}>
                          <Flex align="center" gap={3}>
                            <Box
                              p={2}
                              borderRadius="lg"
                              bg={meta.bg}
                              border="1px solid"
                              borderColor={meta.border}
                            >
                              <ActionIcon size={14} color={meta.color.replace(".", "-")} style={{ color: "inherit" }} />
                            </Box>
                            <Text fontWeight="bold" fontSize="sm" color="white">
                              {log.action}
                            </Text>
                          </Flex>
                        </Table.Cell>

                        {/* Seal ID */}
                        <Table.Cell>
                          {log.sealId ? (
                            <Text
                              fontFamily="mono"
                              fontSize="xs"
                              color="green.300"
                              bg="rgba(74,222,128,0.08)"
                              px={3}
                              py={1}
                              borderRadius="md"
                              display="inline-block"
                            >
                              {log.sealId}
                            </Text>
                          ) : (
                            <Text fontSize="xs" color="whiteAlpha.400">—</Text>
                          )}
                        </Table.Cell>

                        {/* User */}
                        <Table.Cell>
                          <Text fontSize="sm" color="whiteAlpha.700">
                            {log.userId?.email || log.userId?.name || "Public"}
                          </Text>
                          {log.userId?.role && (
                            <Text fontSize="xs" color="whiteAlpha.400">
                              {log.userId.role}
                            </Text>
                          )}
                        </Table.Cell>

                        {/* Result */}
                        <Table.Cell>
                          <ResultBadge result={log.result} />
                        </Table.Cell>

                        {/* IP Address */}
                        <Table.Cell>
                          <Text fontFamily="mono" fontSize="xs" color="whiteAlpha.500">
                            {log.ipAddress || "—"}
                          </Text>
                        </Table.Cell>

                        {/* Timestamp */}
                        <Table.Cell textAlign="right">
                          <Text fontSize="sm" color="whiteAlpha.700">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </Text>
                          <Text fontSize="xs" color="whiteAlpha.500">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </Text>
                        </Table.Cell>

                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {!isLoading && pagination.pages > 1 && (
          <Flex justify="center" align="center" gap={4} mt={6}>
            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              Prev
            </Button>

            <Text fontSize="sm" color="whiteAlpha.500">
              Page {page} of {pagination.pages}
            </Text>

            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </Flex>
        )}

      </Container>
    </Box>
  );
};

export default AuditLogs;
