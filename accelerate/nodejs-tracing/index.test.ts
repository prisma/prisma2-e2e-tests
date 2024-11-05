import { test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { context } from '@opentelemetry/api'
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { Resource } from '@opentelemetry/resources'
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  ReadableSpan,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

let inMemorySpanExporter: InMemorySpanExporter

beforeAll(() => {
  const contextManager = new AsyncHooksContextManager().enable()
  context.setGlobalContextManager(contextManager)

  inMemorySpanExporter = new InMemorySpanExporter()

  const basicTracerProvider = new BasicTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'test-name',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
    }),
  })

  basicTracerProvider.addSpanProcessor(new SimpleSpanProcessor(inMemorySpanExporter))
  basicTracerProvider.register()

  registerInstrumentations({
    instrumentations: [new PrismaInstrumentation({ middleware: true })],
  })
})

beforeEach(() => {
  inMemorySpanExporter.reset()
})

afterAll(() => {
  context.disable()
})

async function waitForSpans(): Promise<ReadableSpan[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return inMemorySpanExporter.getFinishedSpans()
}

function cleanSpansForSnapshot(spans: ReadableSpan[]) {
  // Sort the spans by name to ensure stable order in a snapshot
  const sortedSpans = spans.sort((a, b) => a.name.localeCompare(b.name, 'en-US'))

  // Remove spans about "SELECT 1" query which is sometimes issued and sometimes isn't
  const filteredSpans = sortedSpans.filter((span) => span.attributes?.['db.statement'] !== 'SELECT 1')

  return JSON.parse(
    JSON.stringify(filteredSpans, (key, value) => {
      const removedKeys = ['endTime', 'startTime', 'resource', 'status', 'events', 'instrumentationLibrary']

      if (removedKeys.includes(key)) {
        return undefined
      }

      if (key[0] === '_') return undefined
      if (key === 'itx_id') return '<itxId>'
      if (key === 'db.statement') return '<dbStatement>'
      if (key === 'spanId') return '<spanId>'
      if (key === 'traceId') return '<traceId>'
      if (key === 'parentSpanId') return '<parentSpanId>'

      return value
    }),
  )
}

test('accelerate tracing with postgres', async () => {
  let prisma = new PrismaClient()

  if (process.env.DATAPROXY_FLAVOR === 'DP2+Extension') {
    prisma = prisma.$extends(withAccelerate()) as any
  }

  await prisma.user.findMany()
  const spans = await waitForSpans()

  expect(cleanSpansForSnapshot(spans)).toMatchInlineSnapshot(`
[
  {
    "attributes": {
      "method": "findMany",
      "model": "User",
      "name": "User.findMany",
    },
    "kind": 0,
    "links": [],
    "name": "prisma:client:operation",
    "parentSpanId": "<parentSpanId>",
  },
  {
    "attributes": {},
    "kind": 0,
    "links": [],
    "name": "prisma:client:serialize",
    "parentSpanId": "<parentSpanId>",
  },
  {
    "attributes": {},
    "kind": 0,
    "links": [],
    "name": "prisma:engine",
    "parentSpanId": "<parentSpanId>",
  },
  {
    "attributes": {
      "db.system": "postgresql",
    },
    "kind": 0,
    "links": [],
    "name": "prisma:engine:connection",
    "parentSpanId": "<parentSpanId>",
  },
  {
    "attributes": {
      "db.statement": "<dbStatement>",
      "db.system": "postgresql",
    },
    "kind": 2,
    "links": [],
    "name": "prisma:engine:db_query",
    "parentSpanId": "<parentSpanId>",
  },
  {
    "attributes": {},
    "kind": 0,
    "links": [],
    "name": "prisma:engine:serialize",
    "parentSpanId": "<parentSpanId>",
  },
]
`)
})
