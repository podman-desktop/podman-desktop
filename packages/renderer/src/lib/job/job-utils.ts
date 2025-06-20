/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import type { V1Job } from '@kubernetes/client-node';

import type { JobCondition, JobUI } from './JobUI';

export class JobUtils {
  getJobUI(job: V1Job): JobUI {
    // Retrieve the job condition
    const condition = getJobCondition(job);

    /*
    TODO IN THE FUTURE: In the future,we should add more statuses to StatusIcon.
     Status is an enum that can be 'RUNNING', 'STARTING', 'USED', 'DEGRADED', 'DELETING', 'CREATED'
     However, this does EXACTLY match the job status, as jobs will show as "Running" even though that
    pods are not running yet, but the actual JOB is in progress.
    So we need to determine the status based on the job status instead.
    condition = completed then we are "done" with the job, so we will put '' as status, this just makes the icon solid / no colour.
    condition = unknown it is "degraded"
    condition = running it is "running"
    condition = pending it is "starting"
    condition = failed it is "used"
    */
    let status: string;
    switch (condition) {
      case 'completed':
        status = '';
        break;
      case 'unknown':
        status = 'DEGRADED';
        break;
      case 'failed':
        status = 'DEGRADED';
        break;
      case 'running':
        status = 'RUNNING';
        break;
      case 'pending':
        status = 'STARTING';
        break;
      default:
        status = 'CREATED';
    }

    return {
      kind: 'Job',
      uid: job.metadata?.uid ?? '',
      name: job.metadata?.name ?? '',
      status,
      condition,
      namespace: job.metadata?.namespace ?? '',
      created: job.metadata?.creationTimestamp,
      succeeded: job.status?.succeeded ?? 0,
      completions: job.spec?.completions ?? 0,
    };
  }
}

// We get the condition by checking the job status
// and determining if we are running / failed / etc.
// see: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#jobstatus-v1-batch
// this is different than the normal "status" field as it's different for jobs
function getJobCondition(job: V1Job): JobCondition {
  if (!job.status) {
    return 'unknown';
  }

  if (job.status.succeeded && job.status.succeeded > 0) {
    return 'completed';
  }

  if (job.status.failed && job.status.failed > 0) {
    return 'failed';
  }

  if (job.status.active && job.status.active > 0) {
    return 'running';
  }

  return 'pending';
}
