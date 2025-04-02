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

/**
 * Partial interface representing the response data to GitHub REST API `/repos/{org}/{repo}/discussions/{discussion_number}`
 * There is no official schema for this endpoint (ref https://github.com/github/rest-api-description/issues/4702)
 */
export interface GithubDiscussionsData {
  /**
   * Discussion number
   */
  number: number;

  /**
   * Number of comments
   */
  comments: number;
  /**
   * Discussions reactions summary
   */
  reactions: {
    '+1': number;
    '-1': number;
  };
}
