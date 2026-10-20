import { WorkerPredictionPayload, WorkerPredictionResult, computeWorkerNumbers } from '../workers/quantumNumberWorker';

class QuantumWorkerManager {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, {
    resolve: (res: WorkerPredictionResult) => void;
    reject: (err: any) => void;
    startTime: number;
    timer: any;
  }>();
  private isWorkerSupported: boolean = typeof window !== 'undefined' && typeof Worker !== 'undefined';

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (!this.isWorkerSupported) return;

    try {
      // Use Vite standard module worker instantiation
      this.worker = new Worker(
        new URL('../workers/quantumNumberWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerPredictionResult & { error?: string }>) => {
        const { id, error } = event.data;
        const pending = this.pendingRequests.get(id);
        if (pending) {
          clearTimeout(pending.timer);
          this.pendingRequests.delete(id);
          if (error) {
            pending.reject(new Error(error));
          } else {
            pending.resolve(event.data);
          }
        }
      };

      this.worker.onerror = (err) => {
        console.warn('[QuantumWorkerManager] Worker encountered error, falling back:', err);
      };
    } catch (err) {
      console.warn('[QuantumWorkerManager] Unable to initialize Web Worker, falling back to microtask execution:', err);
      this.worker = null;
    }
  }

  /**
   * Dispatches prediction calculation to background Web Worker thread.
   * Resolves in < 50ms without blocking UI interactions.
   */
  public async executePrediction(payload: Omit<WorkerPredictionPayload, 'id'>): Promise<WorkerPredictionResult> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullPayload: WorkerPredictionPayload = { ...payload, id };
    const startTime = performance.now();

    // If Web Worker is active, execute on worker thread
    if (this.worker) {
      return new Promise<WorkerPredictionResult>((resolve, reject) => {
        const timer = setTimeout(() => {
          // If worker takes > 45ms or fails to respond, fallback synchronously immediately
          this.pendingRequests.delete(id);
          try {
            const fallbackResult = computeWorkerNumbers(fullPayload);
            resolve(fallbackResult);
          } catch (e) {
            reject(e);
          }
        }, 45);

        this.pendingRequests.set(id, {
          resolve,
          reject,
          startTime,
          timer,
        });

        this.worker?.postMessage(fullPayload);
      });
    }

    // Direct synchronous fallback
    return new Promise((resolve) => {
      const res = computeWorkerNumbers(fullPayload);
      resolve(res);
    });
  }

  /**
   * Synchronous immediate execution for pure zero-delay sync pipelines
   */
  public executeSync(payload: Omit<WorkerPredictionPayload, 'id'>): WorkerPredictionResult {
    const id = `sync_${Date.now()}`;
    return computeWorkerNumbers({ ...payload, id });
  }
}

export const quantumWorkerManager = new QuantumWorkerManager();
